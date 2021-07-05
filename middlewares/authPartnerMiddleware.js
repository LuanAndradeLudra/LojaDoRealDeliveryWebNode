function authAdminMiddleware(request, response, next){
    if (request.session.partner != undefined){
        next();
    } else {
        request.flash("msg", `Você precisa estar logado para utilizar essa função`);
        response.redirect("/partner/login");
    }
}

module.exports = authAdminMiddleware;