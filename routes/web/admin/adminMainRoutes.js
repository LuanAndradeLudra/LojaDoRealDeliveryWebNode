const Express = require("express");
const router = new Express.Router();

//Middlewares
const authAdminMiddleware = require("../../../middlewares/authAdminMiddleware");

//Models
const productsModel = require("../../../database/models/productsModel");
const categoriesModel = require("../../../database/models/categoriesModel");
const schedulesModel = require("../../../database/models/schedulesModel");
const partnersModel = require("../../../database/models/partnersModel");

router.get("/home", authAdminMiddleware, async function(req, res){
    var qntProducts = 0;
    var qntCategories = 0;
    var qntSchedules = 0;
    var qntPartners = 0;
    await productsModel.findAndCountAll().then((products) => qntProducts = products['count']);
    await categoriesModel.findAndCountAll().then((categories) => qntCategories = categories['count']);
    await schedulesModel.findAndCountAll().then((schedules) => qntSchedules = schedules['count']);
    await partnersModel.findAndCountAll().then((partners) => qntPartners = partners['count']);
    var msg = req.flash("msg");
    msg = msg.length == 0 ? undefined : msg;
    res.render("admin/home",{
        "msg" : msg,
        "qntProducts": qntProducts,
        "qntCategories": qntCategories,
        "qntSchedules": qntSchedules,
        "qntPartners": qntPartners,
    });
});

module.exports = router;