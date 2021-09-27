const request = require('request-promise');
const config = require('../../config.default');

const WX_ADDR = config.wxMicro.apiAddr;
const APP_KEY = config.wxMicro.appKey;
const APP_SECRET = config.wxMicro.appSecret;

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