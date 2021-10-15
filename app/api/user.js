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
                //address: `required`,
                //occupation: `required`,
                //interest: `required`,

            }
        },
        this.signInRule = {
            rule: {
                openId: `required`,
            }
        },
        this.wxCodeRule = {
            rule: {
                code: `required`,
            }
        },
        this.joinConfirmRule = {
            rule: {
                openId: `required`,
                amount: `required`,
                productId: `required`,
            }
        },
        this.ifJoinRule = {
            rule: {
                openId: `required`,
                productId: `required`,
            }
        },
        this.activityJoinRule = {
            rule: {
                openId: `required`,
                productId: `required`,
                amount: `required`,
                title: `required`,
                address: `required`,
                activityDate: `required`,
                imgSrc: `required`,
                title: `required`,
            }
        }
    }

    register = async (ctx, next) => {
        try {
            Validate(ctx.request.body, this.registerRule.rule);
            let user = await model.User.findOne({ where: { openId: ctx.request.body.openId } });
            if (user) {
                await model.User.update({
                    ...ctx.request.body
                }, {
                    where: {
                        id: user.id
                    }
                })
                ctx.body = {
                    errno: 0,
                    error: "",
                    data: {

                    }
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
            console.log(e);
            ctx.body = {
                errno: -1,
                error: e.message
            }
        }
    }

    wxCode = async (ctx, next) => {
        try {
            Validate(ctx.request.body, this.wxCodeRule.rule);
            const wxUserSecrrtInfo = await WxClient.auth(ctx.request.body.code);
            //const orderCreateResp = await WxClient.createOrder(1, wxUserSecrrtInfo["openid"]);
            ctx.body = {
                errno: 0,
                data: {
                    openId: wxUserSecrrtInfo["openid"]
                }
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
                    error: "当前微信用户信息未填写",
                }
            }
        } catch (e) {
            ctx.body = {
                errno: -2,
                error: e.message
            }
        }
    }

    joinConfirm = async (ctx, next) => {
        try {
            Validate(ctx.request.body, this.joinConfirmRule.rule)

        } catch (e) {
            console.error(e);
            ctx.body = {
                errno: -5,
                error: e.message
            }
        }
    }

    ifJoin = async (ctx, next) => {
        try {
            Validate(ctx.request.body, this.ifJoinRule.rule)
            const orderDetail = await model.OrderDetail.findOne({
                where: {
                    openId: ctx.request.body.openId,
                    productId: ctx.request.body.productId,
                    orderStatus: 1,
                }
            })
            ctx.body = {
                errno: 0,
                error: "",
                data: {
                    ifJoin: orderDetail ? true : false
                }
            }
        } catch (e) {
            console.error(e);
            ctx.body = {
                errno: -5,
                error: e.message
            }
        }
    }

    activityJoin = async (ctx, next) => {
        try {
            Validate(ctx.request.body, this.activityJoinRule.rule);
            let user = await model.User.findOne({
                where: {
                    openId: ctx.request.body.openId
                }
            })

            if (!user) {
                return ctx.body = {
                    errno: -7,
                    error: "用户未注册，不能参加活动"
                }
            }
            const orderCreateResp = await WxClient.createOrder(ctx.request.body);
            ctx.body = {
                errno: 0,
                data: {
                    orderCreateResp
                }
            }
        } catch (e) {
            console.error(e);
            ctx.body = {
                errno: -6,
                error: e.message
            }
        }
    }

    orders = async (ctx, next) => {
        try {
            Validate(ctx.request.body, this.signInRule.rule)
            const orderList = await model.OrderDetail.findAll({ where: { openId: ctx.request.body.openId } });
            const orderListRet = [];
            for (let i in orderList) {
                orderListRet.push({
                    productId: orderList[i].productId,
                    address: orderList[i].address,
                    activityDate: orderList[i].activityDate,
                    imgSrc: orderList[i].imgSrc,
                    orderStatus: orderList[i].orderStatus == 0 ? "付款未成功" : "已完成付款",
                    title: orderList[i].title,
                })
            }
            ctx.body = {
                errno: 0,
                data: {
                    orders: orderListRet
                },
                error: "",
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