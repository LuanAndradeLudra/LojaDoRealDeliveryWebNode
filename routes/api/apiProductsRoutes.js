const Express = require("express");
const router = new Express.Router();

//Models
const productsModel = require("../../database/models/productsModel");
const categoriesModel = require("../../database/models/categoriesModel");

//Middlewares
const authApiMiddleware = require("../../middlewares/authApiMiddleware");

router.get("/products", authApiMiddleware, function(req, res){
    productsModel.findAll({ include: [{ model: categoriesModel }],}).then((products) => {
        res.status(200).json(products);
    }).catch((error) => res.status(400).json({ error: "Erro ao listar produtos" }));
});

module.exports = router;