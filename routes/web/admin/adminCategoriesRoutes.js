const Express = require("express");
const router = new Express.Router();

//Middlewares
const authAdminMiddleware = require("../../../middlewares/authAdminMiddleware");

//Models
const categoriesModel = require("../../../database/models/categoriesModel");

router.get("/categories/create", authAdminMiddleware, function(req, res){
    var msg = req.flash("msg");
    msg = msg.length == 0 ? undefined : msg;
    res.render("admin/categories/categoriescreate",{
        "msg" : msg,
    });
});

router.post("/categories/create", authAdminMiddleware, function(req, res){
    var {name, description} = req.body;
    categoriesModel.findOne({where: {name: name}}).then((category) => {
        if (category == undefined){
            categoriesModel.create({
                name: name,
                description: description,
            }).then(() => {
                req.flash("msg", `Categoria ${name} criada com sucesso!`);
                res.redirect("/admin/categories");
            }).catch((error) => console.log("Erro: " + error));
        } else {
            req.flash("msg", "Essa categoria já existe!");
            res.redirect("/admin/categories/create");
        }
    }).catch((error) => console.log("Erro: " + error));

});

router.get("/categories/edit/:id", authAdminMiddleware, function(req, res){
    var msg = req.flash("msg");
    msg = msg.length == 0 ? undefined : msg;
    categoriesModel.findOne({where: {id: req.params.id}}).then((category) => {
        res.render("admin/categories/categoriesedit",{
            "msg" : msg,
            "category": category,
        });
    }).catch((error) => console.log("Erro: " + error));
});

router.post("/categories/edit", authAdminMiddleware, function(req, res){
    var {id, name, description} = req.body;
    if (id != undefined){
        categoriesModel.update({
            name: name, 
            description: description,
        }, {
            where: {
            id: id,
        },}
        ).then(() => {
            req.flash("msg", `Categoria ${name} alterada com sucesso!`);
            res.redirect("/admin/categories");
        }).catch((error) => console.log("Erro: " + error));
    } else {
        req.flash("msg", "Essa categoria não existe!");
        res.redirect("/admin/categories");
    }
    categoriesModel.findOne({where: {id: id}}).then((category) => {
        if (category != undefined){
            CategoriesModel.update({
                name: name,
                description: description,
            }).then(() => {
                req.flash("msg", "Categoria alterada com sucesso!");
                res.redirect("/admin/categories");
            }).catch((error) => console.log("Erro: " + error));
        } else {
            req.flash("msg", "Essa categoria não existe!");
            res.redirect("/admin/categories/create");
        }
    }).catch((error) => console.log("Erro: " + error));

});

router.get("/categories", authAdminMiddleware, function(req, res){
    var msg = req.flash("msg");
    msg = msg.length == 0 ? undefined : msg;
    categoriesModel.findAll().then((categories) => {
        res.render("admin/categories/categories",{
            "msg" : msg,
            "categories": categories,
        });
    }).catch((error) => console.log("Erro: " + error));
});

router.post("/categories/delete", authAdminMiddleware, function(req, res){
    var {id, name} = req.body;
    categoriesModel.destroy({where: {id: id}}).then(() => {
        req.flash("msg", `Categoria ${name} deletada com sucesso!`);
        res.redirect("/admin/categories");
    }).catch((error) => console.log("Erro: " + error));
});

module.exports = router;