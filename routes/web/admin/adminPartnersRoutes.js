const Express = require("express");
const router = new Express.Router();
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

//Middlewares
const authAdminMiddleware = require("../../../middlewares/authAdminMiddleware");

//Models
const partnersModel = require("../../../database/models/partnersModel");
const schedulesModel = require("../../../database/models/schedulesModel");

router.get("/partners/create", authAdminMiddleware, function (req, res) {
    var msg = req.flash("msg");
    msg = msg.length == 0 ? undefined : msg;
    res.render("admin/partners/partnerscreate", {
        "msg": msg,
    });
});

router.get("/partners/schedules", authAdminMiddleware, function (req, res) {
    schedulesModel.findAll().then((schedules) => {
        var msg = req.flash("msg");
        msg = msg.length == 0 ? undefined : msg;
        res.render("admin/partners/schedules", {
            "msg": msg,
            "schedules": schedules,
        });
    });
});

router.post("/partners/schedules/delete", authAdminMiddleware, function (req, res) {
    var {id, name} = req.body;
    schedulesModel.destroy({where: {id: id}}).then((schedules) => {
        req.flash("msg", `O agendamento do ${name} foi deletado!`);
                res.redirect("/admin/home");
    });
});


router.post("/partners/create", authAdminMiddleware, function (req, res) {
    var { name, email, phone, cep, city, district, address, number, password, document } = req.body;
    if (city == "" || district == "" || address == "") {
        req.flash("msg", `Preencha os dados de localidade!`);
        res.redirect("/admin/partners/create");
    } else {
        partnersModel.findOne({ where: { document: document } }).then((partner) => {
            if (partner == undefined) {
                partnersModel.create({
                    name: name,
                    email: email,
                    phone: phone,
                    cep: cep,
                    city: city,
                    district: district,
                    address: address,
                    number: number,
                    password: bcrypt.hashSync(password, salt),
                    document: document,
                    coordinatesA: 0,
                    coordinatesB: 0,
                }).then(() => {
                    req.flash("msg", `Parceiro ${name} criado com sucesso!`);
                    res.redirect("/admin/partners");
                }).catch((error) => console.log("Erro: " + error));
            } else {
                req.flash("msg", "Esse Parceiro já está cadastrado!");
                res.redirect("/admin/partners/create");
            }
        }).catch((error) => console.log("Erro: " + error));
    }

});

router.get("/partners/edit/:id", authAdminMiddleware, function (req, res) {
    var msg = req.flash("msg");
    msg = msg.length == 0 ? undefined : msg;
    partnersModel.findOne({ where: { id: req.params.id } }).then((partner) => {
        res.render("admin/partners/partnersedit", {
            "msg": msg,
            "partner": partner,
        });
    }).catch((error) => console.log("Erro: " + error));
});

router.post("/partners/edit", authAdminMiddleware, function (req, res) {
    var { id, name, email, phone, cep, city, district, address, number, password, document } = req.body;
    if (id != undefined) {
        partnersModel.update({
            name: name,
            email: email,
            phone: phone,
            cep: cep,
            city: city,
            district: district,
            address: address,
            number: number,
            document: document,
        }, {
            where: {
                id: id,
            },
        }
        ).then(() => {
            req.flash("msg", `Parceiro ${name} alterado com sucesso!`);
            res.redirect("/admin/partners");
        }).catch((error) => console.log("Erro: " + error));
    } else {
        req.flash("msg", "Essa parceiro não existe!");
        res.redirect("/admin/partners");
    }
});

router.get("/partners", authAdminMiddleware, function (req, res) {
    var msg = req.flash("msg");
    msg = msg.length == 0 ? undefined : msg;
    partnersModel.findAll().then((partners) => {
        res.render("admin/partners/partners", {
            "msg": msg,
            "partners": partners,
        });
    }).catch((error) => console.log("Erro: " + error));
});

router.post("/partners/delete", authAdminMiddleware, function (req, res) {
    var { id, name } = req.body;
    if (id != 1){
        partnersModel.destroy({ where: { id: id } }).then(() => {
            req.flash("msg", `Franqueado ${name} deletado com sucesso!`);
            res.redirect("/admin/partners");
        }).catch((error) => console.log("Erro: " + error));
    } else {
        req.flash("msg", `Você não pode deletar esse franqueado!`);
        res.redirect("/admin/partners");
    }
}); 

module.exports = router;