const Sequelize = require("sequelize");
const Connection = require("../database");
const PartnersModel = require("./partnersModel");

const OrdersModel = Connection.define('orders', {
    clientId : {
        type: Sequelize.INTEGER,
        allownull: false,
    },
    partnerId : {
        type: Sequelize.INTEGER,
        allownull: false,
    },
    products: {
        type: Sequelize.STRING(10000),
        allownull: false,
    },
    value: {
        type: Sequelize.DOUBLE,
        allownull: false,
    },
    stage: {
        type: Sequelize.INTEGER,
        allownull: false,
    },
});


OrdersModel.belongsTo(PartnersModel);

OrdersModel.sync({force: false});

module.exports = OrdersModel;