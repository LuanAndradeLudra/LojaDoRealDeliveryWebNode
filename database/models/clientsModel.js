const Sequelize = require("sequelize");
const Connection = require("../database");
const OrdersModel = require("./ordersModel");

const ClientsModel = Connection.define('clients', {
    name: {
        type: Sequelize.STRING,
        allownull: false,
    },
    email: {
        type: Sequelize.STRING,
        allownull: false,
    },
    phone: {
        type: Sequelize.STRING,
        allownull: false,
    },
    cep: {
        type: Sequelize.STRING,
        allownull: false,
    },
    city: {
        type: Sequelize.STRING,
        allownull: false,
    },
    district: {
        type: Sequelize.STRING,
        allownull: false,
    },
    address: {
        type: Sequelize.STRING,
        allownull: false,
    },
    number: {
        type: Sequelize.STRING,
        allownull: false,
    },
    coordinatesA: {
        type: Sequelize.STRING,
        allownull: false,
    },
    coordinatesB: {
        type: Sequelize.STRING,
        allownull: false,
    },
    password: {
        type: Sequelize.STRING,
        allownull: false,
    },
    imgUrl: {
        type: Sequelize.STRING,
        allownull: false,
    },
});

ClientsModel.hasMany(OrdersModel);
OrdersModel.belongsTo(ClientsModel);

ClientsModel.sync({ force: false });

module.exports = ClientsModel;