var createClientOnlyOrdersReport = function(data) {
        $("#OrderOnlyClientReport").empty();
        $("#orders-only-in-client-header").text("Orders only in "+diff.apiKey+" - "+data.length);
        for(order of data){
            var val = "";
            for(var i = 0;i < order.values.length; i++){
                val += "<tr>"+
                    "<th scope='row'>"+(i+1)+"</th>"+
                    "<td>"+order.values[i].pid+"</td> "+
                    "<td>"+order.values[i].sku+"</td> "+
                    "<td>"+formatCurrencyValue(order.values[i].price)+"</td>"+
                    "<td>"+formatIntegerValue(order.values[i].quantity)+"</td>"+
                "</tr>"
            }

        $("#OrderOnlyClientReport").append("<div class='panel panel-default'>"+
            "<div class='panel-heading' role='tab' id='heading"+order.key+"'>"+
                "<h4 class='panel-title'>"+
                    "<a class='collapsed' role='button' data-toggle='collapse'"+
                    // "data-parent='#OrderOnlyClientReport'"+
                    "href='#collapse"+order.key+"' aria-expanded='false' aria-controls='collapse"+order.key+"'>"+
                        "Order Id: "+order.key+" - "+order.values[0].timestamp.format('YYYY/MM/DD HH:mm:ss')+
                    "</a>"+
                "</h4>"+
            "</div>"+
            "<div id='collapse"+order.key+"' class='panel-collapse collapse' role='tabpanel' aria-labelledby='heading"+order.key+"'>"+
                "<div class='panel-body'>"+
                    "<p>User Id: "+order.values[0].uid+"<p>"+
                    "<p>Timestamp: "+order.values[0].timestamp.format('YYYY/MM/DD HH:mm:ss')+"<p>"+
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
                            val+
                        "</tbody>"+
                    "</table>"+
                "</div>"+
            "</div>"+
        "</div>");
        }
      },

    createPlatformOnlyOrdersReport = function(data) {
        $("#OrderOnlyPlatformReport").empty();
        $("#orders-only-in-platform-header").text("Orders only in "+diff.platformName+" - "+data.length);
        for(order of data){
            var val = "";
            for(var i = 0;i < order.values.length; i++){
                val += "<tr>"+
                    "<th scope='row'>"+(i+1)+"</th>"+
                    "<td>"+order.values[i].pid+"</td> "+
                    "<td>"+order.values[i].sku+"</td> "+
                    "<td>"+formatCurrencyValue(order.values[i].price)+"</td>"+
                    "<td>"+formatIntegerValue(order.values[i].quantity)+"</td>"+
                "</tr>"
            }

            $("#OrderOnlyPlatformReport").append("<div class='panel panel-default'>"+
                "<div class='panel-heading' role='tab' id='heading"+order.key+"'>"+
                    "<h4 class='panel-title'>"+
                        "<a class='collapsed' role='button' data-toggle='collapse'"+
                        // "data-parent='#OrderOnlyPlatformReport'"+
                        "href='#collapse"+order.key+"' aria-expanded='false' aria-controls='collapse"+order.key+"'>"+
                            "Order Id: "+order.key+" - "+order.values[0].timestamp.format('YYYY/MM/DD HH:mm:ss')+
                        "</a>"+
                    "</h4>"+
                "</div>"+
                "<div id='collapse"+order.key+"' class='panel-collapse collapse' role='tabpanel' aria-labelledby='heading"+order.key+"'>"+
                    "<div class='panel-body'>"+
                        "<p>User Id: "+order.values[0].uid+"<p>"+
                        "<p>Timestamp: "+order.values[0].timestamp.format('YYYY/MM/DD HH:mm:ss')+"<p>"+
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
                                val+
                            "</tbody>"+
                        "</table>"+
                    "</div>"+
                "</div>"+
            "</div>");
        }
    },

    showReport = function(clientDump, platformDump) {
        var percentageOfOrderOnlyInCliente = ((clientDump.onlyOrders.size*100)/clientDump.numberOfOrders).toFixed(2),
            percentageOfOrderOnlyInPlatform = ((platformDump.onlyOrders.size*100)/platformDump.numberOfOrders).toFixed(2),
            percentageOfDiffOfOrderInCliente = ((Math.abs(clientDump.numberOfOrders - platformDump.numberOfOrders)*100)/clientDump.numberOfOrders).toFixed(2),
            percentageOfDiffOfOrderInPlatform = ((Math.abs(clientDump.numberOfOrders - platformDump.numberOfOrders)*100)/platformDump.numberOfOrders).toFixed(2),
            percentageOfDifferenceOfAmountInClient = ((Math.abs(clientDump.amountTotal - platformDump.amountTotal)*100)/clientDump.amountTotal).toFixed(2),
            percentageOfDifferenceOfAmountInPlatform = ((Math.abs(clientDump.amountTotal - platformDump.amountTotal)*100)/platformDump.amountTotal).toFixed(2),
            percentageOfInconsistentOrdersInClient = ((diff.inconsistentOrders*100)/clientDump.numberOfOrders).toFixed(2),
            percentageOfInconsistentOrdersInPlatform = ((diff.inconsistentOrders*100)/platformDump.numberOfOrders).toFixed(2);

        $("#blackboard").empty();
        $("#blackboard").append(
            "<table class='table table-bordered'>"+
              "<thead>"+
                "<tr>"+
                  "<th>#</th>"+
                  "<th>"+diff.apiKey+"</th>"+
                  "<th>"+diff.platformName+"</th>"+
                  "<th>Difference</th>"+
                "</tr>"+
              "</thead>"+
              "<tbody>"+
                "<tr>"+
                  "<th scope='row'>Number Of Orders</th>"+
                  "<td>"+formatIntegerValue(clientDump.numberOfOrders)+"</td>"+
                  "<td>"+formatIntegerValue(platformDump.numberOfOrders)+"</td>"+
                  "<td>"+formatIntegerValue(Math.abs(clientDump.numberOfOrders - platformDump.numberOfOrders))+"</td>"+
                "</tr>"+
                "<tr>"+
                  "<th scope='row'>Alone Orders</th>"+
                  "<td>"+formatIntegerValue(clientDump.onlyOrders.size)+"</td>"+
                  "<td>"+formatIntegerValue(platformDump.onlyOrders.size)+"</td>"+
                  "<td>#</td>"+
                "</tr>"+
                "<tr>"+
                  "<th scope='row'>Difference in Number of Orders</th>"+
                  "<td>"+percentageOfDiffOfOrderInCliente+"%</td>"+
                  "<td>"+percentageOfDiffOfOrderInPlatform+"%</td>"+
                  "<td>#</td>"+
                "</tr>"+
                "<tr>"+
                  "<th scope='row'>Alone Orders Representation</th>"+
                  "<td>"+percentageOfOrderOnlyInCliente+"%</td>"+
                  "<td>"+percentageOfOrderOnlyInPlatform+"%</td>"+
                  "<td>#</td>"+
                "</tr>"+
                "<tr>"+
                  "<th scope='row'>Amount Of Orders</th>"+
                  "<td>"+formatCurrencyValue(clientDump.amountTotal.toFixed(2))+"</td>"+
                  "<td>"+formatCurrencyValue(platformDump.amountTotal.toFixed(2))+"</td>"+
                  "<td>"+formatCurrencyValue(Math.abs(clientDump.amountTotal.toFixed(2) - platformDump.amountTotal.toFixed(2)))+"</td>"+
                "</tr>"+
                "<tr>"+
                  "<th scope='row'>Difference in Amount of Orders</th>"+
                  "<td>"+percentageOfDifferenceOfAmountInClient+"%</td>"+
                  "<td>"+percentageOfDifferenceOfAmountInPlatform+"%</td>"+
                  "<td>#</td>"+
                "</tr>"+
                "<tr>"+
                  "<th scope='row'>Average Ticket</th>"+
                  "<td>"+formatCurrencyValue((clientDump.amountTotal/clientDump.numberOfOrders).toFixed(2))+"</td>"+
                  "<td>"+formatCurrencyValue((platformDump.amountTotal/platformDump.numberOfOrders).toFixed(2))+"</td>"+
                  "<td>"+formatCurrencyValue(Math.abs((platformDump.amountTotal/platformDump.numberOfOrders).toFixed(2) - (clientDump.amountTotal/clientDump.numberOfOrders).toFixed(2)))+"</td>"+
                "</tr>"+

                "<tr>"+
                  "<th scope='row'>Inconsistent Orders in common orders: "+diff.inconsistentOrders+"</th>"+
                  "<td>"+percentageOfInconsistentOrdersInClient+"%</td>"+
                  "<td>"+percentageOfInconsistentOrdersInPlatform+"%</td>"+
                  "<td>#</td>"+
                "</tr>"+

              "</tbody>"+
            "</table>"+
            "<div id='alerts' class='col-md-12'>"+
                // checkMaxPercentage(percentageOfOrderOnlyInCliente, "Orders only in client")+
                // checkMaxPercentage(percentageOfOrderOnlyInPlatform, "Orders only in platform")+
                // summarizeReport(percentageOfDiffOfOrderInCliente, percentageOfDifferenceOfAmountInClient)+
                checkMaxPercentage(percentageOfDiffOfOrderInCliente, "Difference of Orders in "+diff.apiKey)+
                //
                checkMaxPercentage(percentageOfDifferenceOfAmountInClient, "Difference of Amount in "+diff.platformName)+
                // checkMaxPercentage(percentageOfDifferenceOfAmountInPlatform, "Diff of Orders in platform")+
                // checkMaxPercentage(percentageOfInconsistentOrdersInClient, "Diff of Orders in platform")+
                // checkMaxPercentage(percentageOfInconsistentOrdersInPlatform, "Diff of Orders in platform")+
            "</div>"
        );
    },

    showCharts = function(clientDateInterval, platformDateInterval) {
        $("#charts").empty();
        $("#chart-wrapper").removeClass("hidden");

        var clientPreparedData = diffOrdersByDay(clientDateInterval, platformDateInterval),
            platformPreparedData = diffAmountsByDay(clientDateInterval, platformDateInterval);

        reusableDiffChart(clientPreparedData, "Number of Orders");
        reusableDiffChart(platformPreparedData, "Amount of Orders");
    },

    createTestedOrdersResultReport = function(data) {
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
                    }
                }
            }

            $("#tested-orders-result").append("<div class='panel panel-"+checkSuccess(newIsOrderOk(teste))+"'>"+
                "<div class='panel-heading' role='tab' id='heading"+order.oid+"'>"+
                    "<h4 class='panel-title'>"+
                        "<a class='collapsed' role='button' data-toggle='collapse'"+
                        // "data-parent='#tested-orders-result'"+
                        "href='#collapse"+teste.oid+"' aria-expanded='false' aria-controls='collapse"+teste.oid+"'>"+
                            "Order Id: "+teste.oid+" - "+teste.clientOrder.values[0].timestamp.format('YYYY/MM/DD HH:mm:ss')+
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

    checkMaxPercentage = function(value, title){
        if (value < 10) {
            if (value >= 5) {
                return "<div class='alert alert-warning'><b>"+title+"</b> is close to the max percentage (Between 5% and 10%) - We need to take make some tests!</div>";
            } else {
                return "<div class='alert alert-success'><b>"+title+"</b> is less than a half of the max percentage - We are Ok</div>";
            }
        } else {
            return "<div class='alert alert-danger'><b>"+title+"</b> is above of the max percentage - The percentage is below of 10%!</div>";
        }
    },

    summarizeReport = function(orderPercentage, amountPercentage){
        if (orderPercentage < 10 && amountPercentage < 10) {
            if (orderPercentage >= 5 && amountPercentage >= 5) {
                return "<div class='alert alert-warning'><b>Difference of Orders on "+diff.apiKey+"</b> or <b>Difference of Amount on "+diff.apiKey+"</b> are close to the max percentage (Between 5% and 10%) - We need to take make some tests</div>";
            } else {
                return "<div class='alert alert-success'><b>Difference of Orders on "+diff.apiKey+"</b> or <b>Difference of Amount on "+diff.apiKey+"</b> are less than a half of the max percentage - We are Ok</div>";
            }
        } else {
            return "<div class='alert alert-danger'><b>Difference of Orders on "+diff.apiKey+"</b> or <b>Difference of Amount on "+diff.apiKey+"</b> are above of the max percentage (10%)</div>";
        }
    },

    productsTestResults = function(teste) {
        var result = "";
        // if (!teste.uidPassed) result += "<span class='glyphicon glyphicon-user'></span>";
        // if (!teste.timestampPassed) result += "<span class='glyphicon glyphicon-calendar'></span>";
        // if (!teste.productsPidPassed){
        //     result += "<span class='glyphicon glyphicon-shopping-cart'></span>";
        //     return result;
        // }
        // if (!teste.productsSkuPassed) result += "<span class='glyphicon glyphicon-tag'></span>";
        // if (!teste.productsAmountPassed) result += "<span class='glyphicon glyphicon-usd'></span>";

        // if (!teste.uidPassed) result += "<span class='label label-danger'>User</span>";
        // if (!teste.timestampPassed) result += "<span class='label label-danger'>Timestamp</span>";
        // if (!teste.productsPidPassed){
        //     result += "<span class='label label-danger'>Product</span>";
        //     return result;
        // }
        // if (!teste.productsSkuPassed) result += "<span class='label label-warning'>Sku</span>";
        // if (!teste.productsAmountPassed) result += "<span class='label label-warning'>Price/Quantity</span>";

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

    toggleErrors = function() {
        var self = $("#error-filter");
        if (self.hasClass("label-danger")){
            self.removeClass("label-danger");
            self.addClass("label-default");
        } else {
            self.removeClass("label-default");
            self.addClass("label-danger");
        }
        if (teste) if (teste.errorOrders === 0) return false;
        $("#tested-orders-result > div").each(function() {
            var self = $(this);
            if(self.hasClass("panel-danger")){
                if(self.hasClass("hidden")){
                    self.removeClass("hidden");
                } else {
                    self.addClass("hidden");
                }
            }
        });
    },

    toggleWarnings = function() {
        var self = $("#warning-filter");
        if (self.hasClass("label-warning")){
            self.removeClass("label-warning");
            self.addClass("label-default");
        } else {
            self.removeClass("label-default");
            self.addClass("label-warning");
        }
        if (teste) if (teste.errorOrders === 0) return false;
        $("#tested-orders-result > div").each(function() {
            var self = $(this);
            if(self.hasClass("panel-warning")){
                if(self.hasClass("hidden")){
                    self.removeClass("hidden");
                } else {
                    self.addClass("hidden");
                }
            }
        });
    },

    toggleSuccess = function() {
        var self = $("#success-filter");
        if (self.hasClass("label-success")){
            self.removeClass("label-success");
            self.addClass("label-default");
        } else {
            self.removeClass("label-default");
            self.addClass("label-success");
        }
        if (teste) if (teste.errorOrders === 0) return false;
        $("#tested-orders-result > div").each(function() {
            var self = $(this);
            if(self.hasClass("panel-success")){
                if(self.hasClass("hidden")){
                    self.removeClass("hidden");
                } else {
                    self.addClass("hidden");
                }
            }
        });
    },

    resetFilters = function() {
        var successFilter = $("#success-filter"),
            warningFilter = $("#warning-filter"),
            errorFilter = $("#error-filter");
        successFilter.attr("class","label label-success");
        warningFilter.attr("class","label label-warning");
        errorFilter.attr("class","label label-danger");
    }
