const Express = require("express");
const router = new Express.Router();

//Middlewares
const authPartnerMiddleware = require("../../../middlewares/authPartnerMiddleware");

//bcrypt
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

//Models
const partnerModel = require("../../../database/models/partnersModel");

router.get("/config/changepassword", authPartnerMiddleware, function(req, res){
    var msg = req.flash("msg");
    msg = msg.length == 0 ? undefined : msg;
    res.render("partner/config/changepassword",{
        msg: msg,
        "partnerName": req.session.partner.name,
    });
});

router.post("/config/changepassword", authPartnerMiddleware, function(req, res){
    var {oldPassword, newPassword} = req.body;
    partnerModel.findOne({where: {id: req.session.partner['id']}}).then((partner) => {
        if (bcrypt.compareSync(oldPassword, partner.password)){
            partnerModel.update({
                password: bcrypt.hashSync(newPassword, salt),
            },{where: {id: req.session.partner['id']}}).then(() => {
                req.flash("msg", "Sua senha foi alterada com sucesso!");
                req.session.partner = undefined;
                res.redirect("/partner/login");
            }).catch((error) => {
                console.log("Erro: " + error);
                res.redirect("/");
            });
        } else {
            req.flash("msg", "Sua senha não corresponde a atual!");
            res.redirect("/partner/config/changepassword");
        }
    }).catch((error) => {
        console.log("Erro: " + error);
        res.redirect("/");
    });

});

module.exports = router;