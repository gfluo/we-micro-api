const Router = require('koa-router');
const api = require('./api');

const routerApi = new Router();
routerApi.post('/api/register', api.User.register);

module.exports = routerApi