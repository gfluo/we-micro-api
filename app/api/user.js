const model = require('../model');
const config = require('../../config.default');

class User {
    async register(ctx, next) {
        let { account, password } = ctx.request.body;
        ctx.body = {
            "errno": 0,
        }
    }
}

module.exports = new User()