const model = require('../model');
const moment = require('moment');

class Activity {
    activities = async (ctx, next) => {
        let activityAll = await model.Activity.findAndCountAll({
            order: [
                ['id', 'DESC']  // 逆序
                // ['id'] 正序
            ]
        })
        activityAll.rows = activityAll.rows.map((item => {
            item = item.toJSON();
            let period = item.endTime > item.startTime ? item.endTime - item.startTime : 0;
            item.period = Math.ceil(period / (3600 * 1000)) + '小时';
            item.startTime = moment(item.startTime).format("YYYY-MM-DD HH:mm:ss");
            item.amount = item.amount / 100;
            return item;
        }))
        ctx.body = {
            errno: 0,
            error: "",
            data: {
                activities: activityAll.rows
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
            activity = activity.toJSON();
            let period = activity.endTime > activity.startTime ? activity.endTime - activity.startTime : 0;
            activity.period = Math.ceil(period / (3600 * 1000)) + '小时';
            activity.startTime = moment(activity.startTime).format("YYYY-MM-DD HH:mm:ss");
            activity.amount = activity.amount / 100;
            activity.link = activity.link.split(',');
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
}

module.exports = new Activity();