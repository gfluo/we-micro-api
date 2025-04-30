const Sequelize = require('sequelize');
const sequelize = require('../db');

const Advise = sequelize.define('advise', {
    id: {
        field: 'id',
        primaryKey: true,
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true
    },
    openId: {
        field: 'open_id',
        type: Sequelize.STRING,
        allowNull: false,
    },
    username: {
        field: 'username',
        type: Sequelize.STRING,
    },
    content: {
        field: 'content',
        type: Sequelize.STRING,
    }
}, {
    timestamps: true,
})

Advise.sync({
    force: false
})

module.exports = Advise