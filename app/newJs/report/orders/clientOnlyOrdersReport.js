var createClientAloneOrdersReport = function(data) {
        dust.render("partials/report/orders/alone/orderPanel", {order: data}, function(err, out) {
            $("#OrderOnlyClientReport").empty();
            $("#orders-only-in-client-header").text("Orders only in "+dumpTools.client.name+" - "+data.length);
            $("#OrderOnlyClientReport").append(out);
        });
    };
