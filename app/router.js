const Router = require('koa-router');
const api = require('./api');

const routerApi = new Router();
console.log(api.User.register);
routerApi.post('/api/register', api.User.register);
routerApi.post('/api/signIn', api.User.signIn);

module.exports = routerApi;
