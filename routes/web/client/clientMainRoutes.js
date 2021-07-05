const Express = require("express");
const router = new Express.Router();
const schedulesModel = require("../../../database/models/schedulesModel");

router.get("/", function(req, res){
    res.render("client/index",{
        quantityItemsInCart: req.session.cart != undefined ? req.session.cart['quantityItemsInCart'] : 0,
        clientA: req.session.client != undefined ? req.session.client : undefined,
        order: req.session.order != undefined ? req.session.order : "",
    });
});

router.get("/beapartner", function (req, res) {
    var msg = req.flash("msg");
    msg = msg.length == 0 ? undefined : msg;
    res.render("client/beapartner",{
        quantityItemsInCart: req.session.cart != undefined ? req.session.cart['quantityItemsInCart'] : 0,
        clientA: req.session.client != undefined ? req.session.client : undefined,
        order: req.session.order != undefined ? req.session.order : "",
        msg: msg,
    });
});

router.post("/beapartner", function(req, res){
    var {name, email, phone, document} = req.body;
    if (name == undefined || email == undefined || phone== undefined || document== undefined){
        req.flash("msg", `Preencha todos os campos!`);
        res.redirect("/beapartner");
    } else {
        schedulesModel.create(req.body).then((data) => {
            req.flash("msg", `Sucesso! Aguarde nosso contato.`);
            res.redirect("/beapartner");
        }).catch((error) => console.log(error));
    }
});

module.exports = router;