var createTestedOrdersResultReport = function(tests) {
        for (test of tests.results) { test.clientOrder.values = test.clientOrder.values.sort(compareProductArray); }
        // for (test of tests){ test.clientProductsPassed = test.clientProductsPassed.sort(compareProductArray); }

        for (test of tests.results){ test.platformOrder.values = test.platformOrder.values.sort(compareProductArray); }
        // for (test of tests){ test.platformProductsPassed = test.platformProductsPassed.sort(compareProductArray); }

        var config = {
            tests: tests,
            platformName: dumpTools.platform.name,
            clientName: dumpTools.client.name,
            checkSuccess: checkSuccess,
            productsTestResults: productsTestResults,
            newIsOrderOkDust: IsOrderOkDust,
            isProductOkDust: isProductOkDust
        };

        dust.render("report/orders/common/orderPanel.dust", config, function(err, out) {
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
    };
