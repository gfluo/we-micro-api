const Validate = require('request-validate');
const model = require('../model');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const WxClient = require('../platform/wx');

class Main {
    constructor() {
        this.signInRule = {
            rule: {
                account: `required`,
                password: `required`,
            }
        },
            this.activityDelRule = {
                rule: {
                    activityId: `required`
                }
            }
    }

    signIn = async (ctx, next) => {
        try {
            Validate(ctx.request.body, this.signInRule.rule);
            const admin = await model.Admin.findOne({
                where: {
                    ...ctx.request.body
                }
            })
            if (admin) {
                const token = jwt.sign({
                    account: admin.account,
                    aid: admin.id,
                },
                    require('../common').jwtSecret,
                    {
                        expiresIn: '168h'
                    });
                ctx.body = {
                    errno: 0,
                    error: "",
                    data: {
                        token: token
                    }
                }
            } else {
                ctx.body = {
                    errno: -9,
                    error: '账号或者密码错误'
                }
            }
        } catch (e) {
            console.error(e);
            ctx.body = {
                errno: -8,
                error: e.message
            }
        }
    }

    users = async (ctx, next) => {
        try {
            let { limit, offset } = ctx.query;
            if (!limit) {
                limit = 10;
            } else {
                limit = parseInt(limit);
            }
            if (!offset) {
                offset = 0;
            } else {
                offset = parseInt(offset);
            }
            const userAll = await model.User.findAndCountAll({
                where: ctx.query.openId ? {
                    openId: ctx.query.openId
                } : null,
                limit: limit,
                offset: offset,
            })

            ctx.body = {
                errno: 0,
                data: {
                    userList: userAll.rows.map((item) => {
                        item = item.toJSON();
                        item.createdAt = moment(item.createdAt).format("YYYY-MM-DD");
                        return item;
                    }),
                    total: userAll.count,
                }
            }
        } catch (e) {
            console.error(e);
            ctx.body = {
                errno: -10,
                error: e.message
            }
        }
    }

    orders = async (ctx, next) => {
        try {
            let { limit, offset } = ctx.query;
            if (!limit) {
                limit = 10;
            } else {
                limit = parseInt(limit);
            }
            if (!offset) {
                offset = 0;
            } else {
                offset = parseInt(offset);
            }
            const orders = await model.OrderDetail.findAndCountAll({
                where: {
                    orderStatus: 1,
                },
                limit: limit,
                offset: offset,
            })

            ctx.body = {
                errno: 0,
                data: {
                    orderList: orders.rows.map((item) => {
                        item = item.toJSON();
                        item.createdAt = moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss");
                        item.orderAmount = parseFloat(item.orderAmount / 100);
                        return item;
                    }),
                    total: orders.count,
                }
            }
        } catch (e) {
            console.error(e);
            ctx.body = {
                errno: -11,
                error: e.message
            }
        }
    }

    activities = async (ctx, next) => {
        try {
            let { limit, offset } = ctx.query;
            if (!limit) {
                limit = 10;
            } else {
                limit = parseInt(limit);
            }
            if (!offset) {
                offset = 0;
            } else {
                offset = parseInt(offset);
            }
            const activities = await model.Activity.findAndCountAll({
                limit: limit,
                offset: offset,
            })

            activities.rows = activities.rows.map((item) => {
                item = item.toJSON();
                item.startTime = moment(item.startTime).format("YYYY-MM-DD HH:mm:ss");
                item.endTime = moment(item.endTime).format("YYYY-MM-DD HH:mm:ss");
                return item;
            })

            ctx.body = {
                errno: 0,
                data: {
                    activityList: activities.rows,
                    total: activities.count,
                }
            }
        } catch (e) {
            console.error(e);
            ctx.body = {
                errno: -11,
                error: e.message
            }
        }
    }

    activityCreate = async (ctx, next) => {
        try {
            if (ctx.request.body.link && ctx.request.body.link instanceof Array) {
                ctx.request.body.link = ctx.request.body.link.join(',');
            }

            if (ctx.request.body.startTime) {
                ctx.request.body.startTime = new Date(ctx.request.body.startTime).getTime()
            }

            if (ctx.request.body.endTime) {
                ctx.request.body.endTime = new Date(ctx.request.body.endTime).getTime()
            }

            if (ctx.request.body.amount) {
                if (typeof ctx.request.body.amount == "number") {
                    ctx.request.body.amount = ctx.request.body.amount * 100;
                } else if (typeof ctx.request.body.amount == "string") {
                    ctx.request.body.amount = parseInt(ctx.request.body.amount) * 100;
                } else {
                    ctx.request.body.amount = 0;
                }
            } else {
                ctx.request.body.amount = 0;
            }

            await model.Activity.create({
                ...ctx.request.body
            })

            ctx.body = {
                errno: 0,
                error: "",
            }
        } catch (e) {
            console.error(e);
            ctx.body = {
                errno: -13,
                error: e.message,
            }
        }
    }

    activityUpdate = async (ctx, next) => {
        try {
            let id = ctx.request.body.id;
            delete ctx.request.body.id;
            if (ctx.request.body.link && ctx.request.body.link instanceof Array) {
                ctx.request.body.link = ctx.request.body.link.join(',');
            }

            if (ctx.request.body.startTime) {
                ctx.request.body.startTime = new Date(ctx.request.body.startTime).getTime()
            }

            if (ctx.request.body.endTime) {
                ctx.request.body.endTime = new Date(ctx.request.body.endTime).getTime()
            }

            if (ctx.request.body.amount) {
                if (typeof ctx.request.body.amount == "number") {
                    ctx.request.body.amount = ctx.request.body.amount * 100;
                } else if (typeof ctx.request.body.amount == "string") {
                    ctx.request.body.amount = parseInt(ctx.request.body.amount) * 100;
                } else {
                    ctx.request.body.amount = 0;
                }
            } else {
                ctx.request.body.amount = 0;
            }

            await model.Activity.update({
                ...ctx.request.body
            }, {
                where: {
                    id: id
                }
            })

            ctx.body = {
                errno: 0,
                error: "",
            }
        } catch (e) {
            console.error(e);
            ctx.body = {
                errno: -18,
                error: e.message,
            }
        }
    }

    activityDel = async (ctx, next) => {
        try {
            Validate(ctx.request.body, this.activityDelRule.rule);
            await model.Activity.destroy({
                where: {
                    id: ctx.request.body.activityId
                }
            })
            ctx.body = {
                errno: 0,
                error: "",
                data: {}
            }
        } catch (e) {
            console.log(e)
            ctx.body = {
                errno: -17,
                error: e.message,
            }
        }
    }

    activityDetail = async (ctx, next) => {
        let activity = await model.Activity.findOne({
            where: {
                id: ctx.request.body.id
            }
        })
        if (activity) {
            ctx.body = {
                errno: 0,
                error: "",
                data: activity
            }
        } else {
            ctx.body = {
                errno: -15,
                error: "当前活动不存在",
            }
        }
    }

    activityQrcodeCreate = async (ctx, next) => {
        try {
            Validate(ctx.request.body, this.activityDelRule.rule);
            const activity = await model.activity.findOne({
                where: {
                    id: ctx.request.body.activityId,
                }
            });
            if (!activity) {
                ctx.body = {
                    errno: -21,
                    error: "当前活动不存在",
                }
                return
            }

            if (!activity.qrcode) {
                const qrcode = await WxClient.createQrCode(ctx.request.body.activityId);
                await model.Activity.update({
                    qrcode: qrcode,
                }, {
                    where: {
                        id: ctx.request.body.activityId,
                    }
                })
            } else {
                console.warn(`当前活动：${ctx.request.body.activityId} 已经生成二维码`)
            }

            ctx.body = {
                errno: 0,
                error: "",
                data: activity,
            }
        } catch (e) {
            console.error(e);
            ctx.body = {
                errno: -20,
                error: e.message
            }
        }
    }
}

module.exports = new Main()