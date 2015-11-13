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
        $("#board-report").remove();
        $("#blackboard").append(
            "<div id='board-report' class='alert alert-info'>"+
                "<h3> Client Data </h3>"+
                // "<p>Number of Rows: "+clientDump.numberOfRows+"<p>"+
                "<p>Number of Orders: "+clientDump.numberOfOrders+"<p>"+
                "<p>Amount of Orders: "+formatCurrencyValue(clientDump.amountTotal.toFixed(2))+"<p>"+
                "<p>Orders only on client: "+clientDump.onlyOrders.size+"<p>"+
                // "<p>Max Day: "+clientDump.extentDays[1].toString()+"<p>"+
                // "<p>Min Day: "+clientDump.extentDays[0].toString()+"<p>"+

                "<h3> Platform Data </h3>"+
                // "<p>Number of Rows: "+platformDump.numberOfRows+"<p>"+
                "<p>Number of Orders: "+platformDump.numberOfOrders+"<p>"+
                "<p>Amount of Orders: "+formatCurrencyValue(platformDump.amountTotal.toFixed(2))+"<p>"+
                "<p>Orders only on platform: "+platformDump.onlyOrders.size+"<p>"+

                "<h3> Diff </h3>"+
                "<p>Diff of Orders: "+Math.abs(clientDump.numberOfOrders - platformDump.numberOfOrders)+"<p>"+
                "<p>Diff of Amount: "+formatCurrencyValue(Math.abs(clientDump.amountTotal - platformDump.amountTotal).toFixed(2))+"<p>"+
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
            $("#tested-orders-result").empty();
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

            $("#tested-orders-result").append("<div class='panel panel-default'>"+
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
        };
