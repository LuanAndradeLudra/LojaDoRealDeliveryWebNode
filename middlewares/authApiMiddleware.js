const jwt = require("jsonwebtoken");
const JWTSECRET = require("../database/Jwt");

function auth(req, res, next){
    const authToken = req.headers['authorization'];
    if (authToken != undefined){
        const bearer = authToken.split(" ");
        const token = bearer[1];

        jwt.verify(token, JWTSECRET, (error, data) => {
            if (error){
                res.status(401);
                res.json({error: "Token não autorizado"});     
            } else {
                req.token = token;
                req.loggedUser = {email: data.email};
                next();
            }
        });
    } else {
        res.status(400).json({error: "Token inválido"}); 
    }
}

module.exports = auth;