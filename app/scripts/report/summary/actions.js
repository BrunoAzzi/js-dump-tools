var showSummary = function(client, platform) {
        var numberOfOrders = {
                client: formatIntegerValue(client.numberOfOrders),
                platform: formatIntegerValue(platform.numberOfOrders),
                difference: formatIntegerValue(Math.abs(client.numberOfOrders - platform.numberOfOrders))
            },
            aloneOrders = {
                client: formatIntegerValue(client.aloneOrders.size),
                platform: formatIntegerValue(platform.aloneOrders.size)
            },
            differenceInNumberOfOrdersPercentage = {
                client: ((Math.abs(client.numberOfOrders - platform.numberOfOrders)*100)/client.numberOfOrders).toFixed(2),
                platform: ((Math.abs(client.numberOfOrders - platform.numberOfOrders)*100)/platform.numberOfOrders).toFixed(2)
            },
            aloneOrdersRepresentationPercentage = {
                client: ((client.aloneOrders.size*100)/client.numberOfOrders).toFixed(2),
                platform: ((platform.aloneOrders.size*100)/platform.numberOfOrders).toFixed(2)
            },
            amountOfOrders = {
                client: formatCurrencyValue(client.amountTotal.toFixed(2)),
                platform: formatCurrencyValue(platform.amountTotal.toFixed(2)),
                difference: formatCurrencyValue(Math.abs(client.amountTotal.toFixed(2) - platform.amountTotal.toFixed(2)))
            },
            differenceInAmountOfOrdersRepresentationPercentage = {
                client: ((Math.abs(client.amountTotal - platform.amountTotal)*100)/client.amountTotal).toFixed(2),
                platform: ((Math.abs(client.amountTotal - platform.amountTotal)*100)/platform.amountTotal).toFixed(2)
            },
            averageTicket = {
                client: formatCurrencyValue((client.amountTotal/client.numberOfOrders).toFixed(2)),
                platform: formatCurrencyValue((platform.amountTotal/platform.numberOfOrders).toFixed(2)),
                difference: formatCurrencyValue(Math.abs((platform.amountTotal/platform.numberOfOrders).toFixed(2) - (client.amountTotal/client.numberOfOrders).toFixed(2)))
            },
            inconsistentOrdersRepresentationPercentage = {
                //TODO find a better name for that
                total: dumpTools.tests.summary.errors + dumpTools.tests.summary.warnings,
                client: (((dumpTools.tests.summary.errors + dumpTools.tests.summary.warnings)*100)/client.numberOfOrders).toFixed(2),
                platform: (((dumpTools.tests.summary.errors + dumpTools.tests.summary.warnings)*100)/platform.numberOfOrders).toFixed(2)
            },
            alert = [
                checkMaxPercentage(differenceInNumberOfOrdersPercentage.client, lang.difference.orders+lang.in+dumpTools.client.name, lang),
                checkMaxPercentage(differenceInNumberOfOrdersPercentage.platform, lang.difference.amount+lang.in+dumpTools.platform.name, lang)
            ],
            options = {
                clientName: client.name,
                platformName: platform.name,
                numberOfOrders: numberOfOrders,
                aloneOrders: aloneOrders,
                differenceInNumberOfOrdersPercentage: differenceInNumberOfOrdersPercentage,
                aloneOrdersRepresentationPercentage: aloneOrdersRepresentationPercentage,
                amountOfOrders: amountOfOrders,
                differenceInAmountOfOrdersRepresentationPercentage: differenceInAmountOfOrdersRepresentationPercentage,
                averageTicket: averageTicket,
                inconsistentOrdersRepresentationPercentage: inconsistentOrdersRepresentationPercentage,
                alert: alert,
                lang: lang
            };

            dust.render("report/summary/table.dust", options, function(err, out) {
                if(err) console.error(err);
                $("#blackboard").empty();
                $("#blackboard").append(out);
            });
    };
