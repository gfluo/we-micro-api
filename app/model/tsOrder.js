const Sequelize = require('sequelize');
const sequelize = require('../db');

const TsOrder = sequelize.define('ts_order', {
    id: {
        field: 'id',
        primaryKey: true,
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true
    },
    pid: {
        field: 'pid',
        type: Sequelize.INTEGER,
    },
    tradeId: {
        field: 'trade_id',
        type: Sequelize.STRING,
        allowNull: false
    },
    orderStatus: {
        field: 'order_status',
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0,
    },
    orderAmount: {
        field: 'order_amount',
        type: Sequelize.INTEGER,
    },
    uid: {
        field: 'uid',
        type: Sequelize.INTEGER,
    }
}, {
    timestamps: true,
})

TsOrder.sync({
    force: false
})

module.exports = TsOrder;