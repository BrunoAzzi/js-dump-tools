var showInfo = function() {
    var showReportButton = $("#showBlackboard");

    // $("#report-loading-gif").removeClass("hidden");

    if(showReportButton.val() === "Show info") changeReportButtonToUpdate();

    resetFilters();

    var platformDateInterval = filterByDateInterval(dumpTools.platform.data, dumpTools.client.extentDays[0], dumpTools.client.extentDays[1]),
        clientDateInterval = filterByDateInterval(dumpTools.client.data, dumpTools.client.extentDays[0], dumpTools.client.extentDays[1]),
        groupedClientInterval = groupByOrders(clientDateInterval),
        groupedPlatformInterval = groupByOrders(platformDateInterval);

    showCharts(clientDateInterval, platformDateInterval);

    getOrdersDifference(groupedClientInterval, groupedPlatformInterval);

    calculateAmountTotals(clientDateInterval, platformDateInterval);

    calculateDumpNumberOfTransactions(dumpTools.client, groupedClientInterval);
    calculateDumpNumberOfTransactions(dumpTools.platform, groupedPlatformInterval);

    showSummary(dumpTools.client, dumpTools.platform);

    showAloneOrdersReport(groupedClientInterval, groupedPlatformInterval);

    for(orderId of getOrdersIntersection(groupedClientInterval, groupedPlatformInterval)){

        var clientOrder = getOrderById(orderId, groupedClientInterval);
        var platformOrder = getOrderById(orderId, groupedPlatformInterval);

        result = testOrder(clientOrder, platformOrder);
        // console.log(result);
        orderResult = newIsOrderOk(result);

        if(orderResult < 0) dumpTools.tests.summary.errors++;
        if(orderResult == 0) dumpTools.tests.summary.warnings++;
        if(orderResult > 0) dumpTools.tests.summary.successes++;

        dumpTools.tests.results.push(result);
    }

    createTestedOrdersResultReport(dumpTools.tests);

    $("#publish-report-button").removeClass("hidden");
    $("#interval").text(moment(dumpTools.client.extentDays[0]).format('YYYY/MM/DD')+" to "+moment(dumpTools.client.extentDays[1]).format('YYYY/MM/DD'));
},

calculateAmountTotals = function(client, platform) {
    var clientTotal = 0,
        platformTotal = 0,
        innerData = diffAmountsByDay(client, platform);

    for (summary of innerData) {
        clientTotal += summary[dumpTools.client.name];
        platformTotal += summary[dumpTools.platform.name];
    }

    dumpTools.client.amountTotal = clientTotal;
    dumpTools.platform.amountTotal = platformTotal;
},

calculateDumpNumberOfTransactions = function(dump, groupedData) {
    dump.numberOfOrders = groupedData.length;
};
