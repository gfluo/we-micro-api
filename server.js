const config = require('./config.default');
const Logger = require("koa-logger");
const jwtKoa = require('koa-jwt');

global.config = config

const Koa = require('koa');
const cors = require('koa2-cors');
const logger = new Logger();
const xmlParser = require('koa-xml-body')
const bodyParser = require('koa-bodyparser');
const moment = require('moment');
const router = require('./app/router');

const app = new Koa();
app.use(logger);
app.use(cors());
app.use(jwtKoa({ secret: require('./app/common').jwtSecret }).unless({
   path: [/^\/admin\/signIn/, /^\/api/] //数组中的路径不需要通过jwt验证
}))
app.use(xmlParser());
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(config.listenPort, () => {
   console.log(moment().format('YYYY-MM-DD HH:mm:ss'), `: server is running at port ${config.listenPort}`)
})
