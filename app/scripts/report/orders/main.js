var showAloneOrdersReport = function(groupedClientInterval, groupedPlatformInterval) {
        $("#alone-orders-report-wrapper").removeClass("hidden");
        createClientAloneOrdersReport(getAllOrdersById(dumpTools.client.aloneOrders, groupedClientInterval));
        createPlatformAloneOrdersReport(getAllOrdersById(dumpTools.platform.aloneOrders, groupedPlatformInterval));
    },

    showCommonOrdersTestResults = function(testResult) {
        createTestedOrdersResultReport(testResult);
    };
