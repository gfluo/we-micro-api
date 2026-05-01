const request = require('request-promise');
const config = require('../../config.default');
const uuid = require('uuid');
const xml2js = require('xml2js');
const crypto = require('crypto');
const model = require('../model');
const redisClient = require('../redis');
const fs = require('fs');
const path = require('path');

const APP_KEY = config.wxMicro.appKey;
const BUSSINESS_ID = config.wxMicro.bussiessId;
const APP_SECRET = config.wxMicro.appSecret;
const API_SECRET = config.wxMicro.apiSecret;
const SERVER_IP = '123.60.8.4';
const ORDER_CREATE_NOTIFY_URL = 'https://www.szstswh.com/api/wxnotify/order/create';

const parseXml = async (xmlData) => {
    let { parseString } = xml2js;
    let res;
    return new Promise((resolve, reject) => {
        parseString(xmlData, {
            trim: true,
            explicitArray: false
        }, function (err, result) {
            if (err) {
                reject(err)
            } else {
                res = result;
                resolve(res.xml);
            }
        });
    })
};

const objToXml = (obj) => {
    let tempObj = Object.assign({}, obj);
    let jsonxml = '';
    if (tempObj) {
        jsonxml += '<xml>';
        Object.keys(tempObj).sort().map(item => {
            jsonxml += `<${item}>${tempObj[item]}</${item}>`
        });
        jsonxml += `</xml>`;
    }

    return jsonxml;
}

const uiPayData = (orderCreateResp, nonceStr) => {
    const obj = {
        appId: APP_KEY,
        timeStamp: new Date().getTime() + "",
        nonceStr,
        package: `prepay_id=${orderCreateResp["prepay_id"]}`,
        signType: "MD5",
    }
    const newObj = createPaySign(obj);
    return newObj;
}

const nonceStr = () => {
    const str = uuid.v4();
    return str.replace(/-/g, "");
}

const createPaySign = (obj) => {
    console.log('print payRequest params', obj);
    let tempObj = Object.assign({}, obj);
    let signStr = "";
    let newObj = {};
    Object.keys(tempObj).sort().map(item => {
        if (tempObj[item] != ""
            && !(tempObj[item] instanceof Array && tempObj[item].length == 0)
            && !(tempObj[item] instanceof Object && Object.keys(tempObj[item]).length == 0)) {
            if (tempObj[item] instanceof Object) {
                tempObj[item] = JSON.stringify(tempObj[item]);
            }
            signStr += (item + "=" + tempObj[item] + "&");
            newObj[item] = tempObj[item];
        }
    });
    if (signStr) {
        signStr += ("key=" + API_SECRET);
    }
    const sign = crypto.createHash('md5').update(signStr, 'utf-8').digest('hex').toUpperCase();
    newObj.paySign = sign;
    delete newObj["appId"];
    return newObj;
}

const createSign = (obj) => {
    let tempObj = Object.assign({}, obj);
    let signStr = "";
    let newObj = {};
    Object.keys(tempObj).sort().map(item => {
        if (tempObj[item] != ""
            && !(tempObj[item] instanceof Array && tempObj[item].length == 0)
            && !(tempObj[item] instanceof Object && Object.keys(tempObj[item]).length == 0)) {
            if (tempObj[item] instanceof Object) {
                tempObj[item] = JSON.stringify(tempObj[item]);
            }
            signStr += (item + "=" + tempObj[item] + "&");
            newObj[item] = tempObj[item];
        }
    });
    if (signStr) {
        signStr += ("key=" + API_SECRET);
    }
    const sign = crypto.createHash('md5').update(signStr, 'utf-8').digest('hex').toUpperCase();
    newObj.sign = sign;
    return newObj;
}

const getToken = async () => {
    try {
        const tokenRedis = await new Promise((resolve, reject) => {
            redisClient.get('wxToken', (err, token) => {
                if (err) {
                    reject(err);
                }
                resolve(token);
            })
        })
        if (tokenRedis) {
            return tokenRedis;
        }
        const resp = await request({
            uri: `https://api.weixin.qq.com/cgi-bin/token`,
            method: "GET",
            qs: {
                grant_type: 'client_credential',
                appid: APP_KEY,
                secret: APP_SECRET,
            }
        })
        const respObj = JSON.parse(resp);
        await new Promise((resolve, reject) => {
            redisClient.set("wxToken", respObj.access_token, 'ex', 7200, (err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            })
        })
        return respObj.access_token;

    } catch (e) {
        console.error(e);
        throw new Error("wx accessToken create failed");
    }
}

exports.auth = async (code) => {
    try {
        const resp = await request({
            // This example demonstrates all of the supported options.
            // Request method (uppercase): POST, DELETE, ...
            uri: `https://api.weixin.qq.com/sns/jscode2session`,
            method: 'GET',
            qs: {
                appid: APP_KEY,
                secret: APP_SECRET,
                js_code: code,
                grant_type: "authorization_code",
            },
            json: true
        });
        return resp;
    } catch (e) {
        console.error(e)
        throw new Error("get openId failed");
    }
}

exports.createQrCode = async (activityId) => {
    try {
        const token = await getToken();
        if (!token) throw new Error('获取 access_token 失败');

        // 路径处理
        const imgDir = path.join(__dirname, '../../file/images/');
        const fileName = `qrcode${activityId}.png`;
        const filePath = path.join(imgDir, fileName);

        // 自动创建目录
        if (!fs.existsSync(imgDir)) {
            fs.mkdirSync(imgDir, { recursive: true });
        }

        // --------------------------
        // 核心：把 request + stream 完全包装成安全 Promise
        // 所有错误都会被捕获，不会逃逸
        // --------------------------
        await new Promise((resolve, reject) => {
            const ws = fs.createWriteStream(filePath);

            // 流错误 → 捕获
            ws.on('error', (err) => {
                console.error('写入文件错误:', err);
                reject(err);
            });

            const req = request({
                uri: `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${token}`,
                method: 'POST',
                json: {
                    scene: `id=${activityId}`,
                    page: 'src/pages/activitydetail/activitydetail',
                    check_path: false,
                },
                timeout: 10000,
            });

            // 请求错误 → 捕获
            req.on('error', (err) => {
                console.error('请求接口错误:', err);
                reject(err);
            });

            // 响应错误（400/500）→ 捕获
            req.on('response', (res) => {
                if (res.statusCode < 200 || res.statusCode >= 300) {
                    const msg = `微信接口返回错误 ${res.statusCode}`;
                    console.error(msg);
                    reject(new Error(msg));
                }
            });

            // 管道完成
            req.pipe(ws)
                .on('finish', resolve)
                .on('close', resolve);
        });

        return `/images/${fileName}`;

    } catch (err) {
        // ✅ 现在这里 100% 能抓到所有错误
        console.error('=== createQrCode 捕获到异常 ===', err.message);
        return null; // 不抛错，不崩进程
    }
};

exports.createOrder = async (orderInfo) => {
    let { amount, openId, productId, title } = orderInfo;
    amount = Math.ceil(amount);
    console.log('print orderCreate params', orderInfo);
    const orderData = {
        sign_type: "MD5",
        appid: APP_KEY,
        mch_id: BUSSINESS_ID,
        nonce_str: nonceStr(),
        device_info: "WEB",
        body: `腾狮-${title}`,
        out_trade_no: new Date().getTime() + '',    //订单号
        total_fee: amount,
        spbill_create_ip: SERVER_IP,
        notify_url: ORDER_CREATE_NOTIFY_URL,
        trade_type: 'JSAPI',
        openid: openId,
    }
    const orderDataSign = createSign(orderData);
    const xmlStr = objToXml(orderDataSign);
    try {
        const resp = await request({
            // This example demonstrates all of the supported options.
            // Request method (uppercase): POST, DELETE, ...
            uri: `https://api.mch.weixin.qq.com/pay/unifiedorder`,
            method: 'POST',
            body: xmlStr,
        });
        let respData = await parseXml(resp);

        console.log('print createOrder resp result', respData);

        //创建订单
        await model.OrderDetail.create({
            openId,
            productId,
            orderAmount: amount,
            orderStatus: 0,
            tradeId: orderData.out_trade_no,
            address: orderInfo.address,
            activityDate: orderInfo.activityDate,
            imgSrc: orderInfo.imgSrc,
            title: orderInfo.title,
        })
        let uiData = uiPayData(respData, orderData.nonce_str);
        return uiData;
    } catch (e) {
        console.error(e)
        throw new Error("wx order create failed");
    }
}

exports.notifyParse = async (obj) => {
    const notify = obj["xml"];
    const resultCode = notify["result_code"][0];
    const returnCode = notify["return_code"][0];
    const outTradeNo = notify["out_trade_no"][0];

    console.log(`returnCode: ${returnCode} ----  resultCode: ${resultCode}`);

    if (resultCode === "SUCCESS" && returnCode === "SUCCESS") {
        await model.OrderDetail.update({
            orderStatus: 1
        }, {
            where: {
                tradeId: outTradeNo
            }
        })
    } else {
        console.log('订单状态异常')
    }

    const retObj = {
        return_code: "SUCCESS"
    }

    return objToXml(retObj)
}