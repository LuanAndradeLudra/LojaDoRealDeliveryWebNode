const Sequelize = require("sequelize");
const Connection = require("../database");

const SchedulesModel = Connection.define('schedules', {
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
    document: {
        type: Sequelize.STRING,
        allownull: false,
    },
});

SchedulesModel.sync({force: false});

module.exports = SchedulesModel;