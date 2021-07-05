const Express = require("express");
const router = new Express.Router();
const Op = require('Sequelize').Op

//bcrypt
var bcrypt = require('bcryptjs');

//Middlewares
const authClientMiddleware = require("../../../middlewares/authClientMiddleware");

//Models
const clientsModel = require("../../../database/models/clientsModel");
const ordersModel = require("../../../database/models/ordersModel");
const partnersModel = require("../../../database/models/partnersModel");

router.get("/login", function (req, res) {
    var msg = req.flash("msg");
    msg = msg.length == 0 ? undefined : msg;
    res.render("client/login", {
        "msg": msg,
        quantityItemsInCart: req.session.cart != undefined ? req.session.cart['quantityItemsInCart'] : 0,
        clientA: req.session.client != undefined ? req.session.client : undefined,
        order: req.session.order != undefined ? req.session.order : "",
    });
});

router.get("/register", function (req, res) {
    var msg = req.flash("msg");
    msg = msg.length == 0 ? undefined : msg;
    res.render("client/register", {
        "msg": msg,
        quantityItemsInCart: req.session.cart != undefined ? req.session.cart['quantityItemsInCart'] : 0,
        clientA: req.session.client != undefined ? req.session.client : undefined,
        order: req.session.order != undefined ? req.session.order : "",
    });
});

router.post("/register", function (req, res) {
    var { name, email, phone, cep, district, city, address, number, password } = req.body;
    if (name == undefined || email == undefined || phone == undefined || cep == undefined || district == undefined || city == undefined || address == undefined || number == undefined || password == undefined || district == "" || city == "" || address == "") {
        req.flash("msg", "Preencha todos os dados");
        res.redirect("/register");
    } else {
        clientsModel.findOne({ where: { email: email } }).then((client) => {
            if (client != undefined) {
                req.flash("msg", "Já existe um usuário com esse email!");
                res.redirect("/register");
            } else {
                clientsModel.create({
                    name: name,
                    email: email,
                    phone: phone,
                    cep: cep,
                    district: district,
                    city: city,
                    address: address,
                    number: number,
                    password: bcrypt.hashSync(password),
                    coordinatesA: 0,
                    coordinatesB: 0,
                    imgUrl: "defaultClient.png",
                }).then((data) => {
                    req.session.client = {
                        id: data['id'],
                        name: name,
                        email: email,
                    };
                    res.redirect("/delivery");
                }).catch((error) => console.log("Erro: " + error));
            }
        }).catch((error) => console.log("Erro: " + error));
    }
});



router.post("/auth", function (req, res) {
    var { email, password } = req.body;
    if (email == undefined || password == undefined) {
        res.status(400).json({ error: "Dados incompletos!" });
    } else {
        clientsModel.findOne({ where: { email: email }, },).then((client) => {
            if (client != undefined) {
                if (bcrypt.compareSync(password, client.password)) {
                    req.session.client = {
                        id: client.id,
                        name: client.name,
                        email: client.email,
                    };
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
                            }, {
                                model: partnersModel, attributes: [
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
                                ]
                            }], where: {
                                stage: {
                                    [Op.lt]: 4,
                                },
                                clientId: client.id,
                            }
                        }).then((data) => {
                            if (data != undefined) {
                                req.session.order = data;
                            }

                            res.redirect("/delivery");
                        }).catch((error) => console.log("Erro: " + error));
                } else {
                    req.flash("msg", "Usuário inválido!");
                    res.redirect("/login");
                }
            } else {
                res.status(400).json({ error: "Usuário ou senha inválido" });
            }
        }).catch((error) => console.log("Erro: " + error));
    }
});

router.get("/logout", authClientMiddleware, function (req, res) {
    req.session.client = undefined;
    req.session.order = undefined;
    res.redirect("/");
});

module.exports = router;