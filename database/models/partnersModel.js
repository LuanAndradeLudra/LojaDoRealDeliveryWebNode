const Sequelize = require("sequelize");
const Connection = require("../database");

const PartnersModel = Connection.define('partners', {
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
    document: {
        type: Sequelize.STRING,
        allownull: false,
    },
});

PartnersModel.sync({ force: false });

module.exports = PartnersModel;