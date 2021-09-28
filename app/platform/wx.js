const request = require('request-promise');
const config = require('../../config.default');
const uuid = require('uuid');
const crypto = require('crypto');

const WX_ADDR = config.wxMicro.apiAddr;
const APP_KEY = config.wxMicro.appKey;
const BUSSINESS_ID = config.wxMicro.bussiessId;
const APP_SECRET = config.wxMicro.appSecret;
const API_SECRET = config.wxMicro.apiSecret;
const SERVER_IP = '123.60.8.4';
const ORDER_CREATE_NOTIFY_URL = 'https://www.szstswh.com//api/wxnotify/order/create';

const parseXml = async (xmlData) => {
    
};

const objToXml = (obj) => {
    let tempObj = Object.assign({}, obj);
    if (tempObj) {
        jsonxml += '<xml>';
        Object.keys(tempObj).sort().map(item => {
            jsonxml += `<${item}>${tempObj[item]}</${item}>`
        });
        jsonxml += `</xml>`;
    }

    return jsonxml;
}

const nonceStr = () => {
    const str = uuid.v4();
    return str.replaceAll("_", "");
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

exports.auth = async (code) => {
    let router = `/sns/jscode2session`;
    try {
        const resp = await request({
            // This example demonstrates all of the supported options.
            // Request method (uppercase): POST, DELETE, ...
            uri: `${WX_ADDR}${router}`,
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

exports.createOrder = async (amount, openId) => {
    const orderData = {
        appid: APP_KEY,
        mch_id: BUSSINESS_ID,
        nonce_str: nonceStr(),
        device_info: "WEB",
        body: "虎威-测试",
        out_trade_no: new Date().getTime() + '',    //订单号
        total_fee: amount,
        spbill_create_ip: SERVER_IP,
        notify_url: ORDER_CREATE_NOTIFY_URL,
        trade_type: 'JSAPI',
        openid: openId,
    }
    const orderDataSign = createSign(orderData);
    const xmlStr = objToXml(orderDataSign);
    let router = `/pay/unifiedorder`;
    try {
        const resp = await request({
            // This example demonstrates all of the supported options.
            // Request method (uppercase): POST, DELETE, ...
            uri: `${WX_ADDR}${router}`,
            method: 'POST',
            body: xmlStr,
        });
        console.log(resp);
        return resp;
    } catch (e) {
        console.error(e)
        throw new Error("get openId failed");
    }
}