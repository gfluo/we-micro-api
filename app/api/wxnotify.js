const WxClient = require('../platform/wx');

class Wxnotify {
    createOrder = async (ctx, next) => {
        const retInfo = await WxClient.notifyParse(ctx.request.body);
        ctx.body = retInfo;
    }
}

module.exports = new Wxnotify();