const model = require('../model');

class Activity {
    activities = async (ctx, next) => {
        let activityAll = await model.Activity.findAndCountAll({

        }) 
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