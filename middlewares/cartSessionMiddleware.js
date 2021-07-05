function cartSessionMiddleware(request, response, next){
    if (request.session.cart == undefined){
        request.session.cart = {productsInCart: [], value: 0, quantityItemsInCart: 0};
    } 
    next();
   
}

module.exports = cartSessionMiddleware;