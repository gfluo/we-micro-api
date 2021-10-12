const Validate = require('request-validate');
const model = require('../model');
const jwt = require('jsonwebtoken');
const moment = require('moment');

class Main {
    constructor() {
        this.signInRule = {
            rule: {
                account: `required`,
                password: `required`,
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
                        item.orderAmount = parseFloat(item.orderAmount/100);
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
}

module.exports = new Main()