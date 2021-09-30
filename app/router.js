const Router = require('koa-router');
const api = require('./api');

const routerApi = new Router();
routerApi.post('/api/register', api.User.register);
routerApi.post('/api/signIn', api.User.signIn);
routerApi.post('/api/wx/code', api.User.wxCode);
routerApi.post('/api/activity/join/status', api.User.ifJoin);
routerApi.post('/api/activity/join', api.User.activityJoin);
routerApi.post('/api/activity/orders', api.User.orders);

//notify
routerApi.post('/api/wxnotify/order/create', api.Wxnotify.createOrder);

module.exports = routerApi;
