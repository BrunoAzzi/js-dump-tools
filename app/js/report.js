var createClientOnlyOrdersReport = function(data) {
        $("#OrderOnlyClientReport").empty();
        for(order of data){
            var val = "";
            for(var i = 0;i < order.values.length; i++){
                val += "<tr>"+
                    "<th scope='row'>"+(i+1)+"</th>"+
                    "<td>"+order.values[i].pid+"</td> "+
                    "<td>"+order.values[i].sku+"</td> "+
                    "<td>"+formatCurrencyValue(order.values[i].price)+"</td>"+
                    "<td>"+order.values[i].quantity+"</td>"+
                "</tr>"
            }

        $("#OrderOnlyClientReport").append("<div class='panel panel-default'>"+
            "<div class='panel-heading' role='tab' id='heading"+order.key+"'>"+
                "<h4 class='panel-title'>"+
                    "<a class='collapsed' role='button' data-toggle='collapse' data-parent='#OrderOnlyClientReport' href='#collapse"+order.key+"' aria-expanded='false' aria-controls='collapse"+order.key+"'>"+
                        "Order Id: "+order.key+
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
        for(order of data){
            var val = "";
            for(var i = 0;i < order.values.length; i++){
                val += "<tr>"+
                    "<th scope='row'>"+(i+1)+"</th>"+
                    "<td>"+order.values[i].pid+"</td> "+
                    "<td>"+order.values[i].sku+"</td> "+
                    "<td>"+formatCurrencyValue(order.values[i].price)+"</td>"+
                    "<td>"+order.values[i].quantity+"</td>"+
                "</tr>"
            }

            $("#OrderOnlyPlatformReport").append("<div class='panel panel-default'>"+
                "<div class='panel-heading' role='tab' id='heading"+order.key+"'>"+
                    "<h4 class='panel-title'>"+
                        "<a class='collapsed' role='button' data-toggle='collapse' data-parent='#OrderOnlyPlatformReport' href='#collapse"+order.key+"' aria-expanded='false' aria-controls='collapse"+order.key+"'>"+
                            "Order Id: "+order.key+
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
            "<div id='board-report' class='panel panel-info'>"+
                "<div class='panel-body'>"+
                    "<div class='col-md-12'>"+
                        "<div class='col-sm-6'>"+
                            "<h3> Client Data </h3>"+
                            // "<p>Number of Rows: "+clientDump.numberOfRows+"</p>"+
                            "<p>Number of Orders: "+clientDump.numberOfOrders+"</p>"+
                            "<p>Amount of Orders: "+formatCurrencyValue(clientDump.amountTotal.toFixed(2))+"</p>"+
                            "<p>Orders only on client: "+clientDump.onlyOrders.size+"</p>"+
                            // "<p>Max Day: "+clientDump.extentDays[1].toString()+"</p>"+
                            // "<p>Min Day: "+clientDump.extentDays[0].toString()+"</p>"+
                        "</div>"+
                        "<div class='col-sm-6'>"+
                            "<h3> Platform Data </h3>"+
                            // "<p>Number of Rows: "+platformDump.numberOfRows+"</p>"+
                            "<p>Number of Orders: "+platformDump.numberOfOrders+"</p>"+
                            "<p>Amount of Orders: "+formatCurrencyValue(platformDump.amountTotal.toFixed(2))+"</p>"+
                            "<p>Orders only on platform: "+platformDump.onlyOrders.size+"</p>"+
                        "</div>"+

                    "</div>"+
                    "<div class='col-md-12'>"+
                        "<div class='col-sm-6'>"+
                            "<h3> Ticket Médio </h3>"+
                            "<p>Client: "+formatCurrencyValue((clientDump.amountTotal/clientDump.numberOfOrders).toFixed(2))+"</p>"+
                            "<p>Platform: "+formatCurrencyValue((platformDump.amountTotal/platformDump.numberOfOrders).toFixed(2))+"</p>"+
                        "</div>"+
                    "</div>"+
                    "<div class='col-sm-12'>"+
                        "<div class='col-sm-12'>"+
                            "<h3> Results - They should be below of 10%</h3>"+
                        "</div>"+
                        "<div class='col-sm-12'>"+
                            "<div class='col-sm-6'>"+
                                "<h4>Alone Orders</h4>"+
                                "<p>Orders only on client: "+percentageOfOrderOnlyInCliente+"% of orders on client</p>"+
                                "<p>Orders only on platform: "+percentageOfOrderOnlyInPlatform+"% of orders on platform</p>"+
                            "</div>"+
                            "<div class='col-sm-6'>"+
                                "<h4>Diff of Orders: "+Math.abs(clientDump.numberOfOrders - platformDump.numberOfOrders)+"</h4>"+
                                "<p>"+percentageOfDiffOfOrderInCliente+"% of orders on client</p>"+
                                "<p>"+percentageOfDiffOfOrderInPlatform+"% of orders on platform</p>"+
                            "</div>"+
                        "</div>"+
                        "<div class='col-sm-12'>"+
                            "<div class='col-sm-6'>"+
                                "<h4>Diff of Amount: "+formatCurrencyValue(Math.abs(clientDump.amountTotal - platformDump.amountTotal).toFixed(2))+"</h4>"+
                                "<p>"+percentageOfDifferenceOfAmountInClient+"% of amount on client</p>"+
                                "<p>"+percentageOfDifferenceOfAmountInPlatform+"% of amount on platform</p>"+
                            "</div>"+
                            "<div class='col-sm-6'>"+
                                "<h4>Inconsistent Orders in common orders: "+diff.inconsistentOrders+"</h4>"+
                                "<p>"+percentageOfInconsistentOrdersInClient+"% of orders on client</p>"+
                                "<p>"+percentageOfInconsistentOrdersInPlatform+"% of orders on platform</p>"+
                            "</div>"+
                        "</div>"+
                    "</div>"+
                "</div>"+
            "</div>"+
            "<div id='alerts' class='col-md-12'>"+
                // checkMaxPercentage(percentageOfOrderOnlyInCliente, "Orders only in client")+
                // checkMaxPercentage(percentageOfOrderOnlyInPlatform, "Orders only in platform")+
                summarizeReport(percentageOfDiffOfOrderInCliente, percentageOfDifferenceOfAmountInClient)+
                // checkMaxPercentage(percentageOfDiffOfOrderInPlatform, "Diff of Orders in platform")+
                //
                // checkMaxPercentage(percentageOfDifferenceOfAmountInClient, "Diff of Orders in platform")+
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

    createClientTitle = function(name) {
        $("#client-title").removeClass("hidden");
        $("#client-file-name").remove();
        $("#file-title").append("<h3 id='client-file-name'>Client File Name: "+name+"</h3>");
    },

    createTestedOrdersResultReport = function(data) {
        $("#accordion-test-results-header").text("Common Orders - Errors: "+data.errorOrders+" Warnings: "+data.warningOrders+" Success: "+data.successOrders);
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
                                "'>"+order.quantity+"</td>"+
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
                                "'>"+order.quantity+"</td>"+
                            "</tr>";
                    }
                }
            }

            $("#tested-orders-result").append("<div class='panel panel-"+checkSuccess(isOrderOk(teste))+"'>"+
                "<div class='panel-heading' role='tab' id='heading"+order.oid+"'>"+
                    "<h4 class='panel-title'>"+
                        "<a class='collapsed' role='button' data-toggle='collapse' data-parent='#tested-orders-result' href='#collapse"+teste.oid+"' aria-expanded='false' aria-controls='collapse"+teste.oid+"'>"+
                            "Order Id: "+teste.oid+
                        "</a>"+
                    "</h4>"+
                "</div>"+
                "<div id='collapse"+teste.oid+"' class='panel-collapse collapse' role='tabpanel' aria-labelledby='heading"+teste.oid+"'>"+
                    "<div class='panel-body'>"+
                        "<div class='col-md-6'>"+
                            "<h3>Client</h3>"+
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
                            "<h3>Platform</h3>"+
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
                return "<div class='alert alert-warning'><b>"+title+"</b> is close to the max percentage (Between 5% and 10%) - We need to take make some tests</div>";
            } else {
                return "<div class='alert alert-success'><b>"+title+"</b> is less than a half of the max percentage - We are Ok</div>";
            }
        } else {
            return "<div class='alert alert-danger'><b>"+title+"</b> is above of the max percentage - We are loosing more than 10% of Orders!</div>";
        }
    },

    summarizeReport = function(orderPercentage, amountPercentage){
        if (orderPercentage < 10 && amountPercentage < 10) {
            if (orderPercentage >= 5 && amountPercentage >= 5) {
                return "<div class='alert alert-danger'><b>Difference of Orders on client</b> or <b>Difference of Amount on client</b> are close to the max percentage (Between 5% and 10%) - We need to take make some tests</div>";
            } else {
                return "<div class='alert alert-danger'><b>Difference of Orders on client</b> or <b>Difference of Amount on client</b> are less than a half of the max percentage - We are Ok</div>";
            }
        } else {
            return "<div class='alert alert-danger'><b>Difference of Orders on client</b> or <b>Difference of Amount on client</b> are above of the max percentage (10%)</div>";
        }
    }
