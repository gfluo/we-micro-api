const model = require('../model');
const Validate = require('request-validate')
const config = require('../../config.default');

class User {
    registerRule() {
        return {
            rule: {
                openId: 'required',

            },
            message: {
                "openId.required": "openId参数不能为空"
            }
        }
    }
    async register(ctx, next) {
        Validate(ctx.request.body, this.registerRule().rule, this.register.message)
        let { account, password } = ctx.request.body;
        ctx.body = {
            "errno": 0,
        }
    }
}

module.exports = new User()