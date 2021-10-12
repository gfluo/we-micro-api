const User = require('./user');
const TsOrder = require('./tsOrder');
const Admin = require('./admin');
const OrderDetail = require('./orderDetail');
const Activity = require('./activity');

//主外键关系绑定
User.hasMany(TsOrder, {
    foreignKey: 'uid', sourceKey: 'id' 
})

TsOrder.belongsTo(User, {
    foreignKey: 'uid', targetId: 'id'
})

module.exports = {
    User,
    OrderDetail,
    Admin,
    TsOrder,
    Activity
}