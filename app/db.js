const { Model } = require('sequelize');
const Sequelize = require('sequelize');
const config = require('../config.default');
const sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, {
    host: config.db.host,
    dialect: 'mysql',
    pool: {
        max: 5, //连接池最大连接数量
        min: 0, //最小连接数量
        idle: 10000, //如果一个线程 10秒内么有被使用过的话，就释放
    },
    logging: true,
});

module.exports = sequelize