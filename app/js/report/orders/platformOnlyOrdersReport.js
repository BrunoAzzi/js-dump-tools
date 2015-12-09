var createPlatformAloneOrdersReport = function(data) {
        dust.render("report/orders/alone/orderPanel.dust", {order: data}, function(err, out) {
            $("#OrderOnlyPlatformReport").empty();
            $("#orders-only-in-platform-header").text("Orders only in "+dumpTools.platform.name+" - "+data.length);
            $("#OrderOnlyPlatformReport").append(out);
        });
    };
