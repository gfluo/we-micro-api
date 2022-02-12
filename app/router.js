const Router = require('koa-router');
const api = require('./api');
const admin = require('./admin');
const util = require('./util');
const config = require('../config.default');

const routerApi = new Router();
routerApi.post('/api/register', api.User.register);
routerApi.post('/api/signIn', api.User.signIn);
routerApi.post('/api/wx/code', api.User.wxCode);
routerApi.post('/api/activity/join/status', api.User.ifJoin);
routerApi.post('/api/activity/join', api.User.activityJoin);
routerApi.post('/api/activity/orders', api.User.orders);
routerApi.post('/api/activities', api.Activity.activities);
routerApi.post('/api/activity/detail', api.Activity.activityDetail);
routerApi.post('/api/user/intro/save', api.User.introSave);

//admin
routerApi.post('/admin/signIn', admin.Admin.signIn);
routerApi.get('/admin/users', admin.Admin.users);
routerApi.get('/admin/orders', admin.Admin.orders);
routerApi.get('/admin/activities', admin.Admin.activities);
routerApi.post('/admin/activity', admin.Admin.activityCreate);
routerApi.post('/admin/activity/del', admin.Admin.activityDel);
routerApi.post('/admin/activity/detail', admin.Admin.activityDetail);
routerApi.post('/admin/activity/update', admin.Admin.activityUpdate);
routerApi.post('/admin/qrcode/create', admin.Admin.activityQrcodeCreate);

routerApi.post('/common/video/upload', util.videoUpload.single('file'), async ctx => {
    ctx.body = {
        errno: 0,
        data: {
            url: `${config.domain}/video/${ctx.file.filename}`
        }
    }
})
//notify
routerApi.post('/api/wxnotify/order/create', api.Wxnotify.createOrder);

module.exports = routerApi;
