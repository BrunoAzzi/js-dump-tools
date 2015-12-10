var createClientAloneOrdersReport = function(data) {
        dust.render("report/orders/alone/orderPanel.dust", {order: data}, function(err, out) {
            $("#OrderOnlyClientReport").empty();
            $("#orders-only-in-client-header").text("Orders only in "+dumpTools.client.name+" - "+data.length);
            $("#OrderOnlyClientReport").append(out);
        });
    };
