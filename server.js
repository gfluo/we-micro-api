const config = require('./config.default');

global.config = config

const Koa = require('koa');
const cors = require('koa2-cors');
const xmlParser = require('koa-xml-body')
const bodyParser = require('koa-bodyparser');
const moment = require('moment');
const router = require('./app/router');

const app = new Koa();
app.use(cors());
app.use(xmlParser())
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(config.listenPort, () => {
   console.log(moment().format('YYYY-MM-DD HH:mm:ss'), `: server is running at port ${config.listenPort}`)
})
