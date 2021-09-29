const Sequelize = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('user', {
    id: {
        field: 'id',
        primaryKey: true,
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true
    },
    username: {
        field: 'username',
        type: Sequelize.STRING,
        allowNull: false,
    },
    openId: {
        field: 'open_id',
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    sex: {
        field: 'sex',
        type: Sequelize.STRING,
        allowNull: false
    },
    birthday: {
        field: 'birthday',
        type: Sequelize.STRING,
        allowNull: true,
    },
    address: {
        field: 'address',
        type: Sequelize.STRING,
        allowNull: true,
    },
    occupation: {
        field: 'occupation',
        type: Sequelize.STRING,
        allowNull: true,
    },
    interest: {
        field: 'interest',
        type: Sequelize.STRING,
        allowNull: true,
    },
    mobile: {
        field: 'mobile',
        type: Sequelize.STRING,
        allowNull: true,
    }
}, {
    timestamps: true,
})

User.sync({
    force: false
})

module.exports = User