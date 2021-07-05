const Express = require("express");
const router = new Express.Router();

//Middlewares
const authPartnerMiddleware = require("../../../middlewares/authPartnerMiddleware");

//Models
const ordersModel = require("../../../database/models/ordersModel");

router.get("/home", authPartnerMiddleware, function (req, res) {
    ordersModel.findAll().then((orders) => {
        var openedOrders = 0;
        var attendanceOrders = 0;
        var finishedOrders = 0;
        var totalGained = 0;
        orders.forEach((order) => {
            if (order['stage'] == 0) {
                openedOrders += 1;
            }
            if (order['stage'] != 0 && order['stage'] < 3) {
                attendanceOrders += 1;
            }
            if (order['stage'] == 3 || order['stage'] == 4) {
                finishedOrders += 1;
                totalGained += order['value'];
            }
        });

        var msg = req.flash("msg");
        msg = msg.length == 0 ? undefined : msg;
        res.render("partner/home", {
            "msg": msg,
            "openedOrders": openedOrders,
            "totalGained": totalGained,
            "attendanceOrders": attendanceOrders,
            "finishedOrders": finishedOrders,
        });
    }).catch((error) => console.log(error));
});

module.exports = router;