const Express = require("express");
const router = new Express.Router();

//Models
const categoriesModel = require("../../database/models/categoriesModel");

//Middlewares
const authApiMiddleware = require("../../middlewares/authApiMiddleware");

router.get("/categories", authApiMiddleware, function(req, res){
    categoriesModel.findAll().then((categories) => {
        res.status(200).json(categories);
    }).catch((error) => res.status(400).json({ error: "Erro ao listar categories" }));
});

module.exports = router;