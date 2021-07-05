const Sequelize = require("sequelize");
const Connection = require("../database");

const AdminsModel = Connection.define('admins', {
    name: {
        type: Sequelize.STRING,
        allownull: false,
    },
    email: {
        type: Sequelize.STRING,
        allownull: false,
    },
    password: {
        type: Sequelize.STRING,
        allownull: false,
    },
});

AdminsModel.sync({ force: false });

module.exports = AdminsModel;