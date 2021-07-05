const Express = require("express");
const router = new Express.Router();
const Op = require('Sequelize').Op

//Models
const ordersModel = require("../../database/models/ordersModel");
const clientsModel = require("../../database/models/clientsModel");
const partnersModel = require("../../database/models/partnersModel");

//Middlewares
const authApiMiddleware = require("../../middlewares/authApiMiddleware");

router.post("/orders/create", authApiMiddleware, function(req, res){
    var { clientId, products, value, partnerId, stage } = req.body;
    if (clientId != undefined && products != undefined && value != undefined && partnerId != undefined && stage != undefined) {    
        ordersModel.create({
            clientId,
            partnerId,
            products,
            value,
            stage,
        }).then(() => res.status(201).json({})).catch((error) => {
            res.status(400).json({ error: "Erro ao realizar pedido!" });
        });
    } else {
        res.status(400).json({ error: "Dados inválidos, verifique os campos e tente novamente!" });
    }
});

router.get("/orders", authApiMiddleware, function(req, res){
    ordersModel.findAll( { include: [{ model: clientsModel }, { model: partnersModel }], }).then((orders) => {
        res.status(200).json(orders);
    }).catch((error) => res.status(400).json({ error: "Erro ao listar pedidos" }));
});

router.post("/orders/update", authApiMiddleware, function(req, res){
    var { id, clientId, products, value, partnerId, stage } = req.body;
    ordersModel.update({
        clientId: clientId,
        products: products,
        value: value,
        partnerId: partnerId,
        stage: stage,
    },{where: {id: id}}).then((order) => {
        if (order == undefined) {
            res.status(204).json({});
        } else {
            res.status(200).json(order);
        }
    }).catch((error) => res.status(400).json({ error: "Erro ao atualizar pedido" }));
});

router.get("/orderopened/:id", authApiMiddleware, function (req, res) {
    var id = req.params.id;
    ordersModel.findOne(
        {
            include: [{
                model: clientsModel,
                attributes: [
                    "id",
                    "name",
                    "email",
                    "phone",
                    "cep",
                    "city",
                    "district",
                    "address",
                    "coordinatesA",
                    "coordinatesB",
		            "imgUrl",
                    "createdAt",
                    "updatedAt",
                ]
            }, { model: partnersModel, attributes: [
                "id",
                "name",
                "email",
                "phone",
                "cep",
                "city",
                "district",
                "address",
                "coordinatesA",
                "coordinatesB",
                "document",
                "createdAt",
                "updatedAt",
            ] }], where: {
                stage: {
                    [Op.lt] : 4,
                },
                clientId: id,
            }
        }
    ).then((order) => {
        if (order == undefined) {
            res.status(204).json({});
        } else {
            order.products = JSON.parse(order.products);
            res.status(200).json(order);
        }
    }).catch((error) => console.log(error));
});

module.exports = router;