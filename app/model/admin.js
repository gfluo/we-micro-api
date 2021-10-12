const Sequelize = require('sequelize');
const sequelize = require('../db');

const Admin = sequelize.define('admin', {
    id: {
        field: 'id',
        primaryKey: true,
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true
    },
    account: {
        field: 'account',
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        field: 'password',
        type: Sequelize.STRING,
        allowNull: false,
    },
}, {
    timestamps: true,
})

Admin.sync({
    force: false
})

module.exports = Admin;