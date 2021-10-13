const Sequelize = require('sequelize');
const sequelize = require('../db');

const Activity = sequelize.define('activity', {
    id: {
        field: 'id',
        primaryKey: true,
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true
    },
    title: {
        field: 'title',
        type: Sequelize.STRING,
        allowNull: false
    },
    address: {
        field: 'address',
        type: Sequelize.STRING,
        allowNull: false
    },
    startTime: {
        field: 'start_time',
        type: Sequelize.BIGINT,
        allowNull: false,
        default: 0,
    },
    endTime: {
        field: 'end_time',
        type: Sequelize.BIGINT,
    },
    describe: {
        field: 'describe',
        type: Sequelize.TEXT,
    },
    link: {
        field: 'link',
        type: Sequelize.TEXT,
    },
    amout: {
        field: 'amount',
        type: Sequelize.INTEGER,
    },
    cover: {
        field: 'cover',
        type: Sequelize.STRING,
    }
}, {
    timestamps: true,
})

Activity.sync({
    force: false
})

module.exports = Activity;