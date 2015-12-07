var createTestedOrdersResultReport = function(data) {
        $("#accordion-test-results-header").text("Common Orders - "+formatIntegerValue(data.errorOrders)+" Errors - "+formatIntegerValue(data.warningOrders)+" Warnings - "+formatIntegerValue(data.successOrders)+" Success");
        $("#tested-orders-result").empty();
        for(teste of data.results) {

            var clientVal = "",
                platformVal = "";

            for (order of teste.clientOrder.values) {
                for(testeProduct of teste.clientProductsPassed) {
                    if (order.pid == testeProduct.pid) {
                        clientVal += "<tr>"+
                                "<th scope='row' class='"+
                                checkSuccess(isProductOk(testeProduct))+
                                "'> # </th>"+
                                "<td class='"+
                                checkSuccess(testeProduct.pidPassed)+
                                "'>"+order.pid+"</td> "+
                                "<td class='"+
                                checkSuccess(testeProduct.skuPassed)+
                                "'>"+order.sku+"</td> "+
                                "<td class='"+
                                checkSuccess(testeProduct.pricePassed)+
                                "'>"+formatCurrencyValue(order.price)+"</td>"+
                                "<td class='"+
                                checkSuccess(testeProduct.quantityPassed)+
                                "'>"+formatIntegerValue(order.quantity)+"</td>"+
                            "</tr>";
                            break;
                    }
                }
            }

            for (order of teste.platformOrder.values) {
                for(testeProduct of teste.platformProductsPassed) {
                    if (order.pid == testeProduct.pid) {
                        platformVal += "<tr>"+
                                "<th scope='row' class='"+
                                checkSuccess(isProductOk(testeProduct))+
                                "'> # </th>"+
                                "<td class='"+
                                checkSuccess(testeProduct.pidPassed)+
                                "'>"+order.pid+"</td> "+
                                "<td class='"+
                                checkSuccess(testeProduct.skuPassed)+
                                "'>"+order.sku+"</td> "+
                                "<td class='"+
                                checkSuccess(testeProduct.pricePassed)+
                                "'>"+formatCurrencyValue(order.price)+"</td>"+
                                "<td class='"+
                                checkSuccess(testeProduct.quantityPassed)+
                                "'>"+formatIntegerValue(order.quantity)+"</td>"+
                            "</tr>";
                            break;
                    }
                }
            }

            $("#tested-orders-result").append("<div class='panel panel-"+checkSuccess(newIsOrderOk(teste))+"'>"+
                "<div class='panel-heading' role='tab' id='heading"+order.oid+"'>"+
                    "<h4 class='panel-title'>"+
                        "<a class='collapsed' role='button' data-toggle='collapse'"+
                        // "data-parent='#tested-orders-result'"+
                        "href='#collapse"+teste.oid+"' aria-expanded='false' aria-controls='collapse"+teste.oid+"'>"+
                            "Order Id: "+teste.oid+" - "+teste.clientOrder.values[0].timestamp.format('YYYY/MM/DD HH:mm:ss')+" - Products (C vs P) : "+teste.clientOrder.values.length+" vs "+teste.platformOrder.values.length+
                        "</a>"+
                        "<div class='pull-right'>"+productsTestResults(teste)+"</span></div>"+
                    "</h4>"+
                "</div>"+
                "<div id='collapse"+teste.oid+"' class='panel-collapse collapse' role='tabpanel' aria-labelledby='heading"+teste.oid+"'>"+
                    "<div class='panel-body'>"+
                        "<div class='col-md-6'>"+
                            "<h3>"+diff.apiKey+"</h3>"+
                            "<p class='text-"+checkSuccess(teste.uidPassed)+"'>User Id: "+teste.clientOrder.values[0].uid+"<p>"+
                            "<p class='text-"+checkSuccess(teste.timestampPassed)+"'>Timestamp: "+teste.clientOrder.values[0].timestamp.format('YYYY/MM/DD HH:mm:ss')+"<p>"+

                            "<table class='table table-bordered'>"+
                                "<thead>"+
                                    "<tr>"+
                                        "<th>#</th>"+
                                        "<th>Product Id</th>"+
                                        "<th>SKU</th>"+
                                        "<th>Price</th>"+
                                        "<th>Quantity</th>"+
                                    "</tr>"+
                                "</thead>"+
                                "<tbody>"+
                                    clientVal+
                                "</tbody>"+
                            "</table>"+

                        "</div>"+
                        "<div class='col-md-6'>"+
                            "<h3>"+diff.platformName+"</h3>"+
                            "<p class='text-"+checkSuccess(teste.uidPassed)+"'>User Id: "+teste.platformOrder.values[0].uid+"<p>"+
                            "<p class='text-"+checkSuccess(teste.timestampPassed)+"'>Timestamp: "+teste.platformOrder.values[0].timestamp.format('YYYY/MM/DD HH:mm:ss')+"<p>"+

                            "<table class='table table-bordered'>"+
                                "<thead>"+
                                    "<tr>"+
                                        "<th>#</th>"+
                                        "<th>Product Id</th>"+
                                        "<th>SKU</th>"+
                                        "<th>Price</th>"+
                                        "<th>Quantity</th>"+
                                    "</tr>"+
                                "</thead>"+
                                "<tbody>"+
                                    platformVal+
                                "</tbody>"+
                            "</table>"+
                        "</div>"+
                    "</div>"+
                "</div>"+
            "</div>");
            }
        },

    checkSuccess = function(value){
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
