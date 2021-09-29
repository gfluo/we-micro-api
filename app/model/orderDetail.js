const Sequelize = require('sequelize');
const sequelize = require('../db');

const OrderDetail = sequelize.define('user', {
    id: {
        field: 'id',
        primaryKey: true,
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true
    },
    productId: {
        field: 'product_id',
        type: Sequelize.STRING,
    },
    openId: {
        field: 'open_id',
        type: Sequelize.STRING,
        allowNull: false,
    },
    tradeId: {
        field: 'trade_od',
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
    }
}, {
    timestamps: true,
})

User.sync({
    force: false
})

module.exports = OrderDetail