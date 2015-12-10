var IsOrderOkDust = function(chunk, context, bodies, params) {
    var teste = {
        timestampPassed: context.get("timestampPassed", true),
        uidPassed: context.get("uidPassed", true),
        // productsSkuPassed: context.get("productsSkuPassed", true),
        productsPidPassed: context.get("productsPidPassed", true),
        productsAmountPassed: context.get("productsAmountPassed", true)
    };
    var retorno = "danger";
    if (teste.timestampPassed && teste.uidPassed) {
        if(teste.productsPidPassed){
            if (teste.productsAmountPassed) {
                retorno = "success";
            } else {
                retorno = "warning";
            }
        }
    }
    return chunk.write(retorno);
},

isProductOkDust = function(chunk, context, bodies, params) {
    var object = "";
    var productTest = {
        // skuPassed: context.get("timestampPassed", true),
        pricePassed: context.get("uidPassed", true),
        quantityPassed: context.get("productsSkuPassed", true),
        pidPassed: context.get("productsPidPassed", true)
    };
    if(productTest.pidPassed){
        if (productTest.pricePassed && productTest.quantityPassed) {
            object = "success";
        } else {
            object = "warning";
        }
    } else {
        object = "danger";
    }
    return chunk.write(object);
};
