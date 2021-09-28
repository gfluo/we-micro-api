const model = require('../model');
const Validate = require('request-validate');
const WxClient = require('../platform/wx');
const config = require('../../config.default');

class User {
    constructor() {
        this.registerRule = {
            rule: {
                openId: 'required',
                sex: 'required',
                birthday: `required`,
                mobile: `required`,
                address: `required`,
                occupation: `required`,
                interest: `required`,

            }
        },
        this.signInRule = {
            rule: {
                openId: `required`,
            }
        }
        this.wxCodeRule = {
            rule: {
                code: `required`,
            }
        }
    }

    register = async (ctx, next) => {
        try {
            Validate(ctx.request.body, this.registerRule.rule);
            let user = await model.User.findOne({ where: { openId: ctx.request.body.openId } });
            if (user) {
                ctx.body = {
                    errno: -4,
                    error: "当前微信用户已经注册"
                }
            } else {
                user = await model.User.create(ctx.request.body);
                ctx.body = {
                    errno: 0,
                    error: "",
                    data: {
                        user
                    },
                }
            }
        } catch (e) {
            ctx.body = {
                errno: -1,
                error: e.message
            }
        }
    }

    wxCode = async (ctx, next) => {
        try {
            Validate(ctx.request.body, this.wxCodeRule.rule);
            const resp = await WxClient.auth(ctx.request.body.code);
            if (resp.data.errno === 0) {
                console.log(0);
                const wxUserSecrrtInfo = resp.data.data;
                const orderCreateResp = await WxClient.createOrder(0.01, wxUserSecrrtInfo["openid"]);
            }

            ctx.body = {
                errno: 0,
                data: resp
            }
        } catch (e) {
            ctx.body = {
                errno: -2,
                error: e.message
            }
        }
    }

    signIn = async (ctx, next) => {
        try {
            Validate(ctx.request.body, this.signInRule.rule)
            const user = await model.User.findOne({ where: { openId: ctx.request.body.openId } })
            if (user) {
                ctx.body = {
                    errno: 0,
                    error: "",
                    data: {
                        user
                    },
                }
            } else {
                ctx.body = {
                    errno: -3,
                    error: "当前微信用户未注册",
                    data: {
                        user
                    },
                }
            }
        } catch (e) {
            ctx.body = {
                errno: -2,
                error: e.message
            }
        }
    }
}

module.exports = new User()