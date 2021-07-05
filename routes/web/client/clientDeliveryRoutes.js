const Express = require("express");
const router = new Express.Router();
const Op = require('Sequelize').Op

//Models
const categoriesModel = require("../../../database/models/categoriesModel");
const productsModel = require("../../../database/models/productsModel");
const ordersModel = require("../../../database/models/ordersModel");
const clientsModel = require("../../../database/models/clientsModel");
const partnersModel = require("../../../database/models/partnersModel");

//Middlewares
const cartSessionMiddleware = require("../../../middlewares/cartSessionMiddleware");
const authClientMiddleware = require("../../../middlewares/authClientMiddleware");
const orderSessionMiddleware = require("../../../middlewares/orderSessionMiddleware");


router.get("/", authClientMiddleware, cartSessionMiddleware, orderSessionMiddleware, async function (req, res) {

    var categories = await categoriesModel.findAll();

    var offset;
    let page = req.query.page == undefined ? 1 : req.query.page;
    offset = page == 1 ? 0 : (parseInt(page) - 1) * 9;
    var products = req.query.category != undefined ?
        await productsModel.findAndCountAll({ limit: 9, offset: offset, where: { categoryId: req.query.category } }).catch((error) => console.log("Erro: ")) :
        req.query.query != undefined ?
            await productsModel.findAndCountAll({ limit: 9, offset: offset, where: { name: { [Op.like]: `%${req.query.query}%` } } }).catch((error) => console.log("Erro: ")) :
            await productsModel.findAndCountAll({ limit: 9, offset: offset, });
    var next;
    var before;
    next = offset + 9 >= products.count ? false : true;
    before = page > 1 ? true : false;
    var url = req.query.category != undefined ?
        `/delivery?category=${req.query.category}&` :
        req.query.query != undefined ?
            `/delivery?query=${req.query.query}&` : "/delivery?";
    res.render("client/delivery/delivery", {
        products: products['rows'],
        categories: categories,
        quantityItemsInCart: req.session.cart['quantityItemsInCart'],
        categorySelected: req.query.category != undefined ? req.query.category : "todos",
        clientA: req.session.client != undefined ? req.session.client : undefined,
        order: req.session.order != undefined ? req.session.order : "",
        next: next,
        before: before,
        page: parseInt(page),
        url: url,
    });
});


router.get("/product/:id", authClientMiddleware, cartSessionMiddleware, orderSessionMiddleware, function (req, res) {
    var id = req.params.id;
    productsModel.findOne({ where: { id: id }, include: [{ model: categoriesModel }], },).then((product) => {
        productsModel.findAll({ limit: 8, where: { categoryId: product.categoryId }, include: [{ model: categoriesModel }], },).then((relatedProducts) => {
            res.render("client/delivery/product", {
                product: product,
                quantityItemsInCart: req.session.cart['quantityItemsInCart'],
                relatedProducts: relatedProducts,
                clientA: req.session.client != undefined ? req.session.client : undefined,
                order: req.session.order != undefined ? req.session.order : "",
            });
        }).catch((error) => console.log("Erro: " + error));
    }).catch((error) => console.log("Erro: " + error));
});

router.post("/increasetocart", authClientMiddleware, cartSessionMiddleware, orderSessionMiddleware, function (req, res) {
    var { id, quantity } = req.body;
    quantity = quantity != undefined ? parseInt(req.body.quantity) : 1;
    if (quantity > 0) {
        productsModel.findOne({ where: { id: id } }).then((product) => {
            if (product != undefined) {
                var exist = false;
                req.session.cart['productsInCart'].forEach((productInCart) => {
                    if (productInCart.product.id == product.id) {
                        console.log("ex");
                        exist = true;
                        productInCart.quantity += quantity;
                        productInCart.total = productInCart.quantity * productInCart.product.price;
                    }
                });
                if (!exist) {
                    req.session.cart['productsInCart'].push({ product: product, quantity: quantity, total: product.price * quantity });
                }
                req.session.cart['value'] += product.price * quantity;
                req.session.cart['quantityItemsInCart'] += quantity;
                req.flash("msg", `Você adicionou ${quantity}x ${product.name}`);
                res.redirect("/delivery/cart");
            }
        }).catch((error) => console.log("Erro: " + error));
    } else {
        res.redirect("/delivery/cart");
    }
});

router.post("/decreaseToCart", authClientMiddleware, cartSessionMiddleware, orderSessionMiddleware, function (req, res) {
    var { id, quantity } = req.body;
    quantity = quantity != undefined ? parseInt(req.body.quantity) : 1;
    if (quantity > 0) {
        productsModel.findOne({ where: { id: id } }).then((product) => {
            if (product != undefined) {
                req.session.cart['productsInCart'].forEach((productInCart) => {
                    if (productInCart.product.name == product.name) {
                        if (productInCart.quantity - 1 >= 1) {
                            productInCart.quantity -= quantity;
                            productInCart.total = productInCart.quantity * productInCart.product.price;
                            req.session.cart['value'] -= product.price;
                            req.session.cart['quantityItemsInCart'] -= quantity;
                            req.flash("msg", `Você removeu ${quantity}x ${product.name}`);
                        }
                    }
                });
                res.redirect("/delivery/cart");
            }
        }).catch((error) => console.log("Erro: " + error));
    } else {
        req.flash("msg", `Quantidade inválida!`);
        res.redirect("/delivery/cart");
    }
});

router.get("/cart", authClientMiddleware, cartSessionMiddleware, orderSessionMiddleware, function (req, res) {
    var msg = req.flash("msg");
    msg = msg.length == 0 ? undefined : msg;
    res.render("client/delivery/cart", {
        cart: req.session.cart,
        quantityItemsInCart: req.session.cart['quantityItemsInCart'],
        msg: msg,
        clientA: req.session.client != undefined ? req.session.client : undefined,
        order: req.session.order != undefined ? req.session.order : "",
    });
});

router.post("/createorder", authClientMiddleware, cartSessionMiddleware, orderSessionMiddleware, function (req, res) {
    if (req.session.cart['value'] < 20) {
        req.flash("msg", `Seu pedido não pode ser abaixo de 20 reais`);
    } else {
        var order = {
            partnerId: 1,
            clientId: req.session.client.id,
            products: JSON.stringify(req.session.cart['productsInCart']),
            value: req.session.cart['value'],
            stage: 0,
        };
        req.session.order = {
            partnerId: 1,
            clientId: req.session.client.id,
            products: req.session.cart['productsInCart'],
            value: req.session.cart['value'],
            stage: 0,
        }
        req.session.cart = { productsInCart: [], value: 0, quantityItemsInCart: 0 };
        ordersModel.create(order).then((data) => {
        }).catch((error) => console.log("Erro: " + error));
    }
    res.redirect("/delivery/cart");
});

router.get("/deletetocart/:product", authClientMiddleware, cartSessionMiddleware, orderSessionMiddleware, function (req, res) {
    var id = req.params.product;
    req.session.cart['productsInCart'].forEach((productInCart) => {
        if (productInCart.product.id == id) {
            req.session.cart['productsInCart'].splice(productInCart, 1);
            req.session.cart['value'] -= productInCart.total;
            req.session.cart['quantityItemsInCart'] -= productInCart.quantity;
            req.flash("msg", `O produto ${productInCart.product.name} foi removido do seu carrinho!`);
        }
    });
    res.redirect("/delivery/cart");
});

router.get("/order", authClientMiddleware, cartSessionMiddleware, function (req, res) {
    if (req.session.order != undefined) {
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
                        "number",
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
                        "number",
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
                    clientId: req.session.client.id,
                }
            }).then((data) => {
                if (data != undefined) {
                    req.session.order = data;
                } else {
                    req.session.order = undefined;
                    res.redirect("/");
                }

                var stage;

                switch (req.session.order['stage']) {
                    case 0:
                        stage = "Aguardando";
                        break;
                    case 1:
                        stage = "Aceito";
                        break;
                    case 2:
                        stage = "Em entrega";
                        break;
                    case 3:
                        stage = "Finalizado";
                        break;
                }

                res.render("client/delivery/order", {
                    quantityItemsInCart: req.session.cart['quantityItemsInCart'],
                    order: req.session.order != undefined ? req.session.order : "",
                    orderProducts: JSON.parse(req.session.order.products),
                    clientA: req.session.client != undefined ? req.session.client : undefined,
                    stage: stage,
                });
            }).catch((error) => console.log("Erro: " + error));

    } else {
        res.redirect("/");
    }
});

router.post("/confirmorder", function (req, res) {
    ordersModel.update({ stage: 4, }, { where: { id: req.session.order['id'] } }).then((data) => {
        req.session.order = undefined;
        res.redirect("/delivery");
    }).catch((error) => console.log("Erro: " + error));
});

module.exports = router;