function authAdminMiddleware(request, response, next){
    if (request.session.admin != undefined){
        next();
    } else {
        request.flash("msg", `Você precisa estar logado para utilizar essa função`);
        response.redirect("/admin/login");
    }
}

module.exports = authAdminMiddleware;