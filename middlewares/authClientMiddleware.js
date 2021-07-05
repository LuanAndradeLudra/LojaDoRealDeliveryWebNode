function authClientMiddleware(request, response, next){
    if (request.session.client != undefined){
        next();
    } else {
        request.flash("msg", `Você precisa estar logado para utilizar essa função`);
        response.redirect("/login");
    }
}

module.exports = authClientMiddleware;