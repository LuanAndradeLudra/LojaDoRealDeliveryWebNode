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
       });
   });
});

router.get("/orders/opened", authPartnerMiddleware, function(req, res) {
    var msg = req.flash("msg");
    msg = msg.length == 0 ? undefined : msg;
    ordersModel.findAll({ include: [{ model: clientsModel }, { model: partnersModel }], where: {stage: {
        [Op.lt] : 4,
    },},}).then((orders) => {
         res.render("partner/orders/orderslist",{
            msg: msg,
            orders: orders,
        });
    });
});

router.get("/orders/waiting", authPartnerMiddleware, function(req, res) {
    var msg = req.flash("msg");
    msg = msg.length == 0 ? undefined : msg;
    ordersModel.findAll({ include: [{ model: clientsModel }, { model: partnersModel }], where: {stage: 0},}).then((orders) => {
         res.render("partner/orders/orderslist",{
            msg: msg,
            orders: orders,
        });
    });
});

router.get("/orders/accepted", authPartnerMiddleware, function(req, res) {
    var msg = req.flash("msg");
    msg = msg.length == 0 ? undefined : msg;
    ordersModel.findAll({ include: [{ model: clientsModel }, { model: partnersModel }], where: {stage: 1},}).then((orders) => {
         res.render("partner/orders/orderslist",{
            msg: msg,
            orders: orders,
        });
    });
});

router.get("/orders/indelivery", authPartnerMiddleware, function(req, res) {
    var msg = req.flash("msg");
    msg = msg.length == 0 ? undefined : msg;
    ordersModel.findAll({ include: [{ model: clientsModel }, { model: partnersModel }], where: {stage: 2},}).then((orders) => {
         res.render("partner/orders/orderslist",{
            msg: msg,
            orders: orders,
        });
    });
});

router.get("/orders/finished", authPartnerMiddleware, function(req, res) {
    var msg = req.flash("msg");
    msg = msg.length == 0 ? undefined : msg;
    ordersModel.findAll({ include: [{ model: clientsModel }, { model: partnersModel }], where: {stage: 3},}).then((orders) => {
         res.render("partner/orders/orderslist",{
            msg: msg,
            orders: orders,
        });
    });
});

router.get("/orders/confirmed", authPartnerMiddleware, function(req, res) { 
    var msg = req.flash("msg");
    msg = msg.length == 0 ? undefined : msg;
    ordersModel.findAll({ include: [{ model: clientsModel }, { model: partnersModel }], where: {stage: 4},}).then((orders) => {
         res.render("partner/orders/orderslist",{
            msg: msg,
            orders: orders,
        });
    });
});

router.post("/order/updatestage", authPartnerMiddleware, function(req, res){
    var {id, stage} = req.body;
    var msg = req.flash("msg");
    msg = msg.length == 0 ? undefined : msg;
    ordersModel.update({stage: stage},{where: {id: id},}).then(() => {
        req.flash("msg", "Pedido alterado com sucesso!");
        res.redirect("/partner/orders/opened");
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