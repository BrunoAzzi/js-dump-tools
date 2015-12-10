var showCharts = function(clientDateInterval, platformDateInterval) {
    cleanAndShowChartWrapper();

    var clientPreparedData = diffOrdersByDay(clientDateInterval, platformDateInterval),
        platformPreparedData = diffAmountsByDay(clientDateInterval, platformDateInterval);

    reusableDiffChart(clientPreparedData, lang.orders.numberOfOrders);
    reusableDiffChart(platformPreparedData, lang.orders.amountOfOrders);
    },

    cleanAndShowChartWrapper = function() {
        $("#charts").empty();
        $("#chart-wrapper").removeClass("hidden");
    };
