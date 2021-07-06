const Express = require("express");
const router = new Express.Router();

//Middlewares
const authadminMiddleware = require("../../../middlewares/authadminMiddleware");

//bcrypt
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

//Models
const adminsModel = require("../../../database/models/adminsModel");

router.get("/config/changepassword", authadminMiddleware, function(req, res){
    var msg = req.flash("msg");
    msg = msg.length == 0 ? undefined : msg;
    res.render("admin/config/changepassword",{
        msg: msg,
    });
});

router.post("/config/changepassword", authadminMiddleware, function(req, res){
    var {oldPassword, newPassword} = req.body;
    adminsModel.findOne({where: {id: req.session.admin['id']}}).then((admin) => {
        if (bcrypt.compareSync(oldPassword, admin.password)){
            adminsModel.update({
                password: bcrypt.hashSync(newPassword, salt),
            },{where: {id: req.session.admin['id']}}).then(() => {
                req.flash("msg", "Sua senha foi alterada com sucesso!");
                req.session.admin = undefined;
                res.redirect("/admin/login");
            }).catch((error) => {
                console.log("Erro: " + error);
                res.redirect("/");
            });
        } else {
            req.flash("msg", "Sua senha não corresponde a atual!");
            res.redirect("/admin/config/changepassword");
        }
    }).catch((error) => {
        console.log("Erro: " + error);
        res.redirect("/");
    });

});

module.exports = router;