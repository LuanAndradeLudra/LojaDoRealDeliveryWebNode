const Express = require("express");
const router = new Express.Router();
var fs = require('fs');
const pathImages = require("../../../utils/pathImages");

const imageProductsPath = pathImages.productPath();

//Middlewares
const authAdminMiddleware = require("../../../middlewares/authAdminMiddleware");
const uploadProductsMiddleware = require("../../../middlewares/uploadProductsMiddleware");

//Controllers
const resizer = require("../../../utils/resizer");

//Models
const productsModel = require("../../../database/models/productsModel");
const categoriesModel = require("../../../database/models/categoriesModel");
const ProductsModel = require("../../../database/models/productsModel");


router.get("/products/create", authAdminMiddleware, function (req, res) {
    categoriesModel.findAll().then((categories) => {
        res.render("admin/products/productscreate", {
            "categories": categories,
        });
    }).catch((error) => console.log("Erro: " + error));

});

router.post("/products/create", authAdminMiddleware, uploadProductsMiddleware,  function (req, res) {
    
    var { name, description, price, amount, categoryId } = req.body;
    price = price.replace(",", ".");
    var imgUrl = "defaultProduct.png";

    if (req.fileUploaded){
        imgUrl = req.fileName;
        resizer(req.file, 500, 500, 100, imageProductsPath);
    }

    productsModel.create({
        name: name,
        description: description,
        price: price,
        amount: amount,
        imgUrl: imgUrl,
        categoryId: categoryId,
    }).then(() => {
        req.flash("msg", `Produto ${name} criado com sucesso!`);
        res.redirect("/admin/products");
    }).catch((error) => console.log("Erro: " + error));

});

router.get("/products/edit/:id", authAdminMiddleware, function (req, res) {
    var id = req.params.id;
    categoriesModel.findAll().then((categories) => {
        productsModel.findOne({where:{id: id}, include: [{ model: categoriesModel }],},).then((product) => {
            if (product != undefined){
                res.render("admin/products/productsedit", {
                    "product": product,
                    "categories": categories,
                });
            } else {
                req.flash("msg", `Houve um erro ao carregar a rota`);
                res.redirect("/admin/home");
            }
        }).catch((error) => console.log("Erro: " + error));
    }).catch((error) => console.log("Erro: " + error));

});

router.post("/products/edit", authAdminMiddleware, uploadProductsMiddleware, function (req, res) {
    var {id, name, description, price, amount, categoryId, oldImg} = req.body;
    price = price.replace(",", ".");
    var imgUrl = "";
    if (oldImg != undefined){ 
        if (req.file != undefined){       
            if (req.fileUploaded){
                imgUrl = req.fileName;
                resizer(req.file, 500, 500, 100, imageProductsPath); 
                imgUrl = req.fileName;
                fs.unlinkSync(`${imageProductsPath}/${oldImg}`);
            }
        } else {
            imgUrl = oldImg;
        }
    } else {
        if (req.fileUploaded){
            imgUrl = req.fileName;
            resizer(req.file, 500, 500, 100, imageProductsPath); 
            imgUrl = req.fileName;
        } else {
            imgUrl = 'defaultProduct.png';
        }
    }
    ProductsModel.update({
        name: name, 
        description: description, 
        price: price, 
        amount: amount, 
        categoryId: categoryId, 
        imgUrl: imgUrl,
    },{
        where: {
            id: id,
        },
    }).then(() => {
        req.flash("msg", `Produto ${name} alterado com sucesso!`);
        res.redirect("/admin/products");
    }).catch((error) => console.log("Erro: " + error));

});

router.get("/products", authAdminMiddleware, function (req, res) {
    
    var msg = req.flash("msg");
    msg = msg.length == 0 ? undefined : msg;

    productsModel.findAll( { include: [{ model: categoriesModel }], }).then((products) => {
        res.render("admin/products/products", {
            "msg": msg,
            "products": products,
        });
    }).catch((error) => console.log("Erro: " + error));
});

router.post("/products/delete", authAdminMiddleware, function (req, res) {
    var {id, name, imgUrl} = req.body;
    if (imgUrl != undefined){
        fs.unlinkSync(`${imageProductsPath}/${imgUrl}`);
    }
    productsModel.destroy({where: {id: id}}).then(() => {
        req.flash("msg", `Produto ${name} deletado com sucesso!`);
        res.redirect("/admin/products");
    }).catch((error) => console.log("Erro: " + error));
});

module.exports = router;