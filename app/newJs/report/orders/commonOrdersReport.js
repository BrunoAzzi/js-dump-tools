var createTestedOrdersResultReport = function(tests) {
            var config = {
                tests: tests,
                platformName: dumpTools.platform.name,
                clientName: dumpTools.client.name,
                checkSuccess: checkSuccess,
                productsTestResults: productsTestResults,
                newIsOrderOkDust: IsOrderOkDust,
                isProductOkDust: isProductOkDust
            };

            dust.render("partials\/report\/orders\/common\/orderPanel", config, function(err, out) {
                debugger;
                $("#tested-orders-result").empty();
                $("#accordion-test-results-header").text("Common Orders - "+
                    formatIntegerValue(dumpTools.tests.summary.errors)+" Errors - "+
                    formatIntegerValue(dumpTools.tests.summary.warnings)+" Warnings - "+
                    formatIntegerValue(dumpTools.tests.summary.successes)+" Success");
                $("#tested-orders-result").append(out);
            });
        },

    checkSuccess = function(chunk, context, bodies, params){
        var value = dust.helpers.tap(params.value, chunk, context);
        if(value === true || value > 0) return "success";
        if(value === false || value < 0) return "danger";
        if(value === 0) return "warning";
    },

    productsTestResults = function(teste) {
        var result = "";

        if (!teste.uidPassed) result += "<span class='label label-danger'><span class='glyphicon glyphicon-user'></span>User</span>";
        if (!teste.timestampPassed) result += "<span class='label label-danger'><span class='glyphicon glyphicon-calendar'></span>Timestamp</span>";
        if (!teste.productsPidPassed){
            result += "<span class='label label-danger'><span class='glyphicon glyphicon-shopping-cart'></span>Product</span>";
            return result;
        }
        if (!teste.productsSkuPassed) result += "<span class='label label-warning'><span class='glyphicon glyphicon-tag'></span>Sku</span>";
        if (!teste.productsAmountPassed) result += "<span class='label label-warning'><span class='glyphicon glyphicon-usd'></span>Price/Quantity</span>";

        return result;
    },

    IsOrderOkDust = function(chunk, context, bodies, params) {
        var teste = {
            timestampPassed: context.get("timestampPassed", true),
            uidPassed: context.get("uidPassed", true),
            productsSkuPassed: context.get("productsSkuPassed", true),
            productsPidPassed: context.get("productsPidPassed", true),
            productsAmountPassed: context.get("productsAmountPassed", true)
        };
        var retorno = "danger";
        if (teste.timestampPassed && teste.uidPassed) {
            if(teste.productsPidPassed){
                if (teste.productsSkuPassed && teste.productsAmountPassed) {
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
            skuPassed: context.get("timestampPassed", true),
            pricePassed: context.get("uidPassed", true),
            quantityPassed: context.get("productsSkuPassed", true),
            pidPassed: context.get("productsPidPassed", true)
        };
        if(productTest.pidPassed){
            if (productTest.skuPassed && productTest.pricePassed && productTest.quantityPassed) {
                object = "success";
            } else {
                object = "warning";
            }
        } else {
            object = "danger";
        }
        return chunk.write(object);
    };
