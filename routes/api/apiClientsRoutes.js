const Express = require("express");
const router = new Express.Router();

//Models
const clientsModel = require("../../database/models/clientsModel");

//bcrypt
var bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

//jwt
const JWTSECRET = require("../../database/jwt");

router.post("/clients/create", function(req, res){
    var {name, email, phone, cep, city, district, address, number, imgUrl, password, coordinatesA, coordinatesB} = req.body;
    if (name != undefined && email != undefined && phone != undefined && cep != undefined && city != undefined && district != undefined && address != undefined && number != undefined && coordinatesA != undefined && coordinatesB != undefined){
        imgUrl = imgUrl != undefined ? imgUrl : "defaultClient.png";
        var client = {
            name: name,
            email: email,
            phone: phone,
            cep: cep,
            city: city,
            district: district,
            address: address,
            number: number,
            imgUrl: imgUrl,
            password: bcrypt.hashSync(password),
            coordinatesA: coordinatesA,
            coordinatesB: coordinatesB,
        };
        clientsModel.findOne({where: {email: email}}).then((user) => {
           if (user == undefined){
                clientsModel.create(client).then((data) => {
                    res.status(201).json(data['dataValues']);
                }).catch((error) => {
                    res.status(400).json({ error: error});
                });
           } else {
            res.status(400).json({ error: "Já existe um usuário cadastrado com esse email!"});
           }
        }).catch((error) => {
            res.status(400).json({ error: error});
        });
    } else {
        res.status(400).json({ error: "Dados inválidos, verifique os dados e tente novamente!"});
    }
});

router.post("/clients/auth", function(req, res){

    var { email, password } = req.body;

    if (email == undefined || password == undefined) {
        res.status(400).json({ error: "Verifique os campos!" });
    } else {
        clientsModel.findOne({
            where: {
                email: email
            }
        }).then((client) => {
            console.log(client);
            if (client == undefined) {
                res.status(400).json({ error: "Dados inválidos!" });
            } else {
                if (bcrypt.compareSync(password, client.password)) {
                    jwt.sign({ email: client.email, }, JWTSECRET, { expiresIn: '24h' }, (error, token) => {
                        if (error) {
                            res.status(400);
                            res.json({ error: "Falha interna" });
                        } else {
                            res.status(200);
                            res.json({
                                client: {
                                    id: client.id,
                                    name: client.name,
                                    email: client.email,
                                    phone: client.phone,
                                    cep: client.cep,
                                    city: client.city,
                                    district: client.district,
                                    address: client.address,
                                    number: client.number,
                                    imgUrl: client.imgUrl,
                                    coordinatesA: client.coordinatesA,
                                    coordinatesB: client.coordinatesB,
                                },
                                token: token,
                            });
                        }
                    });
                } else {
                    res.status(400).json({ error: "Dados inválidos" });
                }
            }
        }).catch((error) => console.log(error));
    }
});

module.exports = router;