var showInfo = function() {

    if($("#showBlackboard").val() === lang.buttons.showInfo) changeReportButtonToUpdate();

    hideInputs();

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

    getOrdersIntersection(groupedClientInterval, groupedPlatformInterval).forEach( function (orderId) {

        var clientOrder = getOrderById(orderId, groupedClientInterval);
        var platformOrder = getOrderById(orderId, groupedPlatformInterval);

        result = testOrder(clientOrder, platformOrder);
        // console.log(result);
        orderResult = newIsOrderOk(result);

        if(orderResult < 0) dumpTools.tests.summary.errors++;
        if(orderResult == 0) dumpTools.tests.summary.warnings++;
        if(orderResult > 0) dumpTools.tests.summary.successes++;

        dumpTools.tests.results.push(result);
    });

    createTestedOrdersResultReport(dumpTools.tests);

    showDowloadButton();
    $("#interval").text(moment(dumpTools.client.extentDays[0]).format('YYYY/MM/DD')+lang.date.intervalIndicator+moment(dumpTools.client.extentDays[1]).format('YYYY/MM/DD'));
},

showGif = function () {
    $("#report-loading-gif").removeClass("hidden");
},

calculateAmountTotals = function(client, platform) {
    var clientTotal = 0,
        platformTotal = 0,
        innerData = diffAmountsByDay(client, platform);

    innerData.forEach( function (summary) {
        clientTotal += summary[dumpTools.client.name];
        platformTotal += summary[dumpTools.platform.name];
    });

    dumpTools.client.amountTotal = clientTotal;
    dumpTools.platform.amountTotal = platformTotal;
},

calculateDumpNumberOfTransactions = function(dump, groupedData) {
    dump.numberOfOrders = groupedData.length;
};
