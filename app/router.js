const Router = require('koa-router');
const api = require('./api');

const routerApi = new Router();
console.log(api.User.register);
routerApi.post('/api/register', api.User.register);
routerApi.post('/api/signIn', api.User.signIn);
routerApi.post('/api/wx/code', api.User.wxCode);

//notify
routerApi.post('/api/wxnotify/order/create', api.Wxnotify.createOrder);

module.exports = routerApi;
