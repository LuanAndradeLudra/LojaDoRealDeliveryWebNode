function orderSessionMiddleware(request, response, next){
    if (request.session.order == undefined){    
        next();
    } else {
        request.flash("msg", `Você já tem um pedido em aberto!`);
        response.redirect("/delivery/order");
    }
}

module.exports = orderSessionMiddleware;