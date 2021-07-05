const Sequelize = require("sequelize");
const Connection = require("../database");
const ProductsModel = require("./productsModel");

const categoriesModel = Connection.define('categories', {
    name: {
        type: Sequelize.STRING,
        allownull: false,
    },
    description: {
        type: Sequelize.STRING,
        allownull: false,
    },
});

categoriesModel.hasMany(ProductsModel);
ProductsModel.belongsTo(categoriesModel);

categoriesModel.sync({force: false});

module.exports = categoriesModel;