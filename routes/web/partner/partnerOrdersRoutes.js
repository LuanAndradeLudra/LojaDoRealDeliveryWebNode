const Express = require("express");
const router = new Express.Router();
const Op = require('Sequelize').Op

//Models
const ordersModel = require("../../../database/models/ordersModel");
const clientsModel = require("../../../database/models/clientsModel");
const partnersModel = require("../../../database/models/partnersModel");

//Middlewares
const authPartnerMiddleware = require("../../../middlewares/authPartnerMiddleware");

router.get("/order/:id", authPartnerMiddleware, function(req, res) {
    var id = req.params.id;
    var msg = req.flash("msg");
    msg = msg.length == 0 ? undefined : msg;
    ordersModel.findOne({ include: [{ model: clientsModel }, { model: partnersModel }], where: {id: id},}).then((order) => {
        res.render("partner/orders/order",{
           msg: msg,
           order: order,
           orderProducts: JSON.parse(order.products),
           "partnerName": req.session.partner.name,
       });
   });
});

router.get("/orders/:stage", authPartnerMiddleware, async function(req, res) {
    var stage = req.params.stage;
    console.log(stage);
    if (stage == "all"){
        var orders = await ordersModel.findAll({ include: [{ model: clientsModel }, { model: partnersModel }], where: {stage: {
            [Op.lt] : 4,
        },},}).catch((error) => {
            console.log("Erro: " + error);
            res.redirect("/");
        });
    } else {
        var orders = await ordersModel.findAll({ include: [{ model: clientsModel }, { model: partnersModel }], where: {stage: stage},}).catch((error) => {
            console.log("Erro: " + error);
            res.redirect("/");
        });
    }

    var msg = req.flash("msg");
    msg = msg.length == 0 ? undefined : msg;
    
    res.render("partner/orders/orderslist",{
        msg: msg,
        orders: orders,
        "partnerName": req.session.partner.name,
    });
});

router.post("/order/updatestage", authPartnerMiddleware, function(req, res){
    var {id, stage} = req.body;
    var msg = req.flash("msg");
    msg = msg.length == 0 ? undefined : msg;
    ordersModel.update({stage: stage},{where: {id: id},}).then(() => {
        req.flash("msg", "Pedido alterado com sucesso!");
        res.redirect("/partner/orders/all");
    });
});

router.post("/order/delete", authPartnerMiddleware, function(req, res){
    var id = req.body.id;
    ordersModel.destroy({where: {id: id},}).then(() => {
        req.flash("msg", "Pedido deletado com sucesso!");
        res.redirect("/partner/home");
    });
});



module.exports = router;