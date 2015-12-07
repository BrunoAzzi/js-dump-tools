var createPlatformAloneOrdersReport = function(data) {
        dust.render("partials/report/orders/alone/orderPanel", {order: data}, function(err, out) {
            $("#OrderOnlyPlatformReport").empty();
            $("#orders-only-in-platform-header").text("Orders only in "+dumpTools.platform.name+" - "+data.length);
            $("#OrderOnlyPlatformReport").append(out);
        });
    };
