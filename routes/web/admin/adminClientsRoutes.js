const Express = require("express");
const router = new Express.Router();

//Middlewares
const authAdminMiddleware = require("../../../middlewares/authAdminMiddleware");


//Models
const clientsModel = require("../../../database/models/clientsModel");
const ordersModel = require("../../../database/models/ordersModel");

router.get("/clients", authAdminMiddleware, function (req, res) {
    
    var msg = req.flash("msg");
    msg = msg.length == 0 ? undefined : msg;

    clientsModel.findAll().then((clients) => {
        res.render("admin/clients/clients", {
            "msg": msg,
            "clients": clients,
        });
    }).catch((error) => console.log("Erro: " + error));
});

router.get("/client/:id", authAdminMiddleware, function (req, res) {

    var id = req.params.id;

    clientsModel.findOne({where: {id: id}}).then((client) => {
        ordersModel.findAll({where: {clientId: id},}).then((orders) => {
            res.render("admin/clients/client", {
                "clientA": client,
                "orders": orders,
            });
        }).catch((error) => {
            console.log("Erro: " + error);
            res.redirect("/");
        });
    }).catch((error) => {
        res.redirect("/");
        console.log("Erro: " + error);
    });
});

router.post("/clients/delete", authAdminMiddleware, function (req, res) {
    var {id, name} = req.body;

    clientsModel.destroy({where: {id: id}}).then(() => {
        req.flash("msg", `Cliente ${name} deletado com sucesso!`);
        res.redirect("/admin/clients");
    }).catch((error) => console.log("Erro: " + error));
});

module.exports = router;