var createPlatformOnlyOrdersReport = function(data) {
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
    };
