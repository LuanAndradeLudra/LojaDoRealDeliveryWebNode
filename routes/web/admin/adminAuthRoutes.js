const Express = require("express");
const router = new Express.Router();

//bcrypt
var bcrypt = require('bcryptjs');

//Middlewares
const authAdminMiddleware = require("../../../middlewares/authAdminMiddleware");

//Models
const adminsModel = require("../../../database/models/adminsModel");

router.get("/login", function(req, res){
    var msg = req.flash("msg");
    msg = msg.length == 0 ? undefined : msg;
    res.render("admin/login",{
        "msg" : msg,
    });
});



router.post("/auth", function(req, res){
    var {email, password} = req.body;
    if (email == undefined || password == undefined){
        res.status(400).json({ error: "Dados incompletos!" });
    } else {
        adminsModel.findOne({where: {email: email},},).then((admin) => {
            if (admin != undefined){
                if (bcrypt.compareSync(password, admin.password)){
                    req.session.admin = {
                        id: admin.id,
                        name: admin.name,
                        email: admin.email,
                    };
                    res.redirect("/admin/home");
                } else {
                    req.flash("msg", "Usuário inválido!");
                    res.redirect("/admin/login");
                }
            } else {
                req.flash("msg", "Usuário inválido!");
                    res.redirect("/admin/login");
            }
        }).catch((error) => console.log("Erro: " + error));
    }
});

router.get("/logout", authAdminMiddleware, function(req, res){
    req.session.admin = undefined;
    res.redirect("/");
});

module.exports = router;