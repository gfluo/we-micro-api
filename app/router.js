const Router = require('koa-router');
const api = require('./api');
const admin = require('./admin');

const routerApi = new Router();
routerApi.post('/api/register', api.User.register);
routerApi.post('/api/signIn', api.User.signIn);
routerApi.post('/api/wx/code', api.User.wxCode);
routerApi.post('/api/activity/join/status', api.User.ifJoin);
routerApi.post('/api/activity/join', api.User.activityJoin);
routerApi.post('/api/activity/orders', api.User.orders);
routerApi.post('/api/activities', api.Activity.activities);
routerApi.post('/api/activity/detail', api.Activity.activityDetail);

//admin
routerApi.post('/admin/signIn', admin.Admin.signIn);
routerApi.get('/admin/users', admin.Admin.users);
routerApi.get('/admin/orders', admin.Admin.orders);
routerApi.get('/admin/activities', admin.Admin.activities);
routerApi.post('/admin/activity', admin.Admin.activityCreate);

//notify
routerApi.post('/api/wxnotify/order/create', api.Wxnotify.createOrder);

module.exports = routerApi;
