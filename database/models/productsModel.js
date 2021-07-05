const Sequelize = require("sequelize");
const Connection = require("../database");

const ProductsModel = Connection.define('products', {
    name: {
        type: Sequelize.STRING,
        allownull: false,
    },
    description: {
        type: Sequelize.STRING,
        allownull: false,
    },
    price: {
        type: Sequelize.DOUBLE,
        allownull: false,
    },
    amount: {
        type: Sequelize.INTEGER,
        allownull: false,
    },
    imgUrl: {
        type: Sequelize.STRING,
        allownull: false,
    },
    categoryId: {
        type: Sequelize.INTEGER,
        allownull: false,
    },
});

ProductsModel.sync({force: false});

module.exports = ProductsModel;