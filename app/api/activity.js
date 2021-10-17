const model = require('../model');
const moment = require('moment');

class Activity {
    activities = async (ctx, next) => {
        let activityAll = await model.Activity.findAndCountAll({

        }) 
        activityAll.rows = activityAll.rows.map((item => {
            item = item.toJSON();
            let period = item.endTime > item.startTime ? item.endTime - item.startTime : 0;
            item.period = Math.ceil(period / 3600) + '小时';
            item.startTime = moment(item.startTime).format("YYYY-MM-DD HH:mm:ss");
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
}

module.exports = new Activity();