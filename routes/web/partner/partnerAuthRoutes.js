const Express = require("express");
const router = new Express.Router();

//bcrypt
var bcrypt = require('bcryptjs');

//Models
const partnerModel = require("../../../database/models/partnersModel");

//Middlewares
const authPartnerMiddleware = require("../../../middlewares/authPartnerMiddleware");

router.get("/login", function(req, res){
    var msg = req.flash("msg");
    msg = msg.length == 0 ? undefined : msg;
    res.render("partner/login",{
        "msg" : msg,
    });
});

router.post("/auth", function(req, res){
    var {email, password} = req.body;
    partnerModel.findOne({where: {email: email},},).then((partner) => {
        if (bcrypt.compareSync(password, partner.password)){
            req.session.partner = {
                id: partner.id,
                name: partner.name,
                email: partner.email,
            };
            res.redirect("/partner/home");
        } else {
            req.flash("msg", "Usuário inválido!");
            res.redirect("/partner/login");
        }
    }).catch((error) => console.log("Erro: " + error));
});

router.get("/logout", authPartnerMiddleware, function(req, res){
    req.session.partner = undefined;
    res.redirect("/");
});

module.exports = router;