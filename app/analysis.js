var diff = {},
    clientFileName,

    showInfo = function() {
        $("#platform-file-chooser-wrapper").addClass("hidden");
        $("#client-file-chooser-wrapper").addClass("hidden");
        $("#api-key-input").prop( "disabled", true );

        var platformDateInterval = filterByDateInterval(diff.platformDump.data, diff.clientDump.extentDays[0], diff.clientDump.extentDays[1]),
            clientDateInterval = filterByDateInterval(diff.clientDump.data, diff.clientDump.extentDays[0], diff.clientDump.extentDays[1]),
            teste = [];

        createClientTitle(clientFileName);

        showCharts(clientDateInterval, platformDateInterval);

        caculateAmountTotals(clientDateInterval, platformDateInterval);

        calculateDumpNumberOfTransactions(diff.clientDump, clientDateInterval);
        calculateDumpNumberOfTransactions(diff.platformDump, platformDateInterval);

        getOrdersDifference(clientDateInterval, platformDateInterval);

        diff.inconsistentOrders = 0;

        for(orderId of getOrdersIntersection(clientDateInterval, platformDateInterval)){
            var clientOrder = getOrderById(orderId, clientDateInterval);
            var platformOrder = getOrderById(orderId, platformDateInterval);
            result = testOrder(clientOrder, platformOrder);
            if(isOrderOk(result) < 1) diff.inconsistentOrders++;
            teste.push(result);
        }

        showReport(diff.clientDump, diff.platformDump);

        createClientOnlyOrdersReport(getAllOrdersById(diff.clientDump.onlyOrders, clientDateInterval));
        createPlatformOnlyOrdersReport(getAllOrdersById(diff.platformDump.onlyOrders, platformDateInterval));
        createTestedOrdersResultReport(teste);

        $("#order-only-on-client").removeClass("hidden");
        $("#report-progress").attr('aria-valuenow','100');
        $("#report-progress").css('width','100%');
        $("#report-progress-bar").addClass("hidden");
    },

    setupPlatform = function(data) {
        data.forEach(function(row) {
            row.timestamp = moment(row.timestamp, ["YYYY-MM-DD HH:mm:ss", moment.ISO_8601]);
        });

        diff.platformDump = makeDump(data);
    },

    setupClient = function(data) {
        data.forEach(function(row) {
            row.timestamp = moment(row.timestamp, ["YYYY-MM-DD HH:mm:ss", moment.ISO_8601]);
        });

        diff.clientDump = makeDump(data);
        diff.clientDump.extentDays = d3.extent(data, function(row) { return row.timestamp });
    },

    makeDump = function(csvData) {
        var object = {
            data: csvData,
            numberOfRows: csvData.length
        }
        return object;
    }

    caculateAmountTotals = function(clientData, platformData) {
        var clientTotal = 0,
            platformTotal = 0,
            innerData = diffAmountsByDay(clientData, platformData);

        for (summary of innerData) {
            clientTotal += summary.client;
            platformTotal += summary.platform;
        }

        diff.clientDump.amountTotal = clientTotal;
        diff.platformDump.amountTotal = platformTotal;
    },

    calculateDumpNumberOfTransactions = function(dump, data) {
        dump.numberOfOrders = groupByOrders(data).length;
    },

    createDateSlider = function(minDate, maxDate) {

        var beginDate = new Date(minDate.toDate());
        beginDate.setHours(0);
        beginDate.setMinutes(0);
        beginDate.setSeconds(0);
        beginDate.setDate(beginDate.getDate()+1);

        var endDate = new Date(maxDate.toDate());
        endDate.setHours(0);
        endDate.setMinutes(0);
        endDate.setSeconds(1);

        var formattedBeginDate = beginDate.getDate()+"/"+(beginDate.getMonth()+1)+"/"+beginDate.getFullYear(),
            formattedEndDate = endDate.getDate()+"/"+(endDate.getMonth()+1)+"/"+endDate.getFullYear();

        $("#beginDate").text(formattedBeginDate);
        $("#endDate").text(formattedEndDate);

        $("#slider").dateRangeSlider({
            arrows: false,
            bounds:{
                min: beginDate,
                max: endDate
            },
            defaultValues:{
                min: beginDate,
                max: endDate
            },
            formatter:function(val){
                var days = val.getDate(),
                    month = val.getMonth() + 1,
                    year = val.getFullYear();
                return days + "/" + month + "/" + year ;
            },
            range:{
                min: {days: 4}
            },
            step: {days: 1}
        });

        $("#slider").bind("valuesChanged", function(e, data){
            diff.clientDump.extentDays[0] = data.values.min;
            diff.clientDump.extentDays[1] = data.values.max;
            console.log("Values just changed. min: " + diff.clientDump.extentDays[0] + " max: " + diff.clientDump.extentDays[1]);
        });
    };

$("#the-client-file-input").change(function() {
    clientFileName = this.files[0].name;
    Papa.parse(this.files[0], {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        // fastMode: true,
        // chunk: function(chunk){
        //   diff.clientData = diff.clientData.concat(chunk.data);
        // },
        error: function(err, reason) {
            console.log(err, reason);
        },
        complete: function(result) {
            console.log(result);
            if (result.errors){
                for (var i = 0; i < result.errors.length; i++) {
                    console.log(result.errors[i]);
                }
            }
            setupClient(result.data);
            $("#platform-file-chooser-wrapper").removeClass("hidden");
            $("#client-warning-tip").addClass("hidden");
            $("#client-success-tip").removeClass("hidden");
            $("#client-progress-bar").addClass("hidden");
        }
 });

  $("#client-progress").attr('aria-valuenow','100');
  $("#client-progress").css('width','100%');

});

$("#the-platform-file-input").change(function() {
  Papa.parse(this.files[0], {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    // fastMode: true,
    // chunk: function(chunk){
    //   diff.platformData = diff.platformData.concat(chunk.data);
    // },
    error: function(err, reason) {
      console.log(err, reason);
    },
    complete: function(result) {
      console.log(result);
      if (result.errors){
        for (var i = 0; i < result.errors.length; i++) {
          console.log(result.errors[i]);
        }
      }
      setupPlatform(result.data);
      $("#report-board").removeClass("hidden");
      $("#platform-warning-tip").addClass("hidden");
      $("#platform-success-tip").removeClass("hidden");
      $("#platform-progress-bar").addClass("hidden");
      $("#api-key-input-wrapper").removeClass("hidden");
      createDateSlider(diff.clientDump.extentDays[0], diff.clientDump.extentDays[1]);
    }
  });

  $("#platform-progress").attr('aria-valuenow','100');
  $("#platform-progress").css('width','100%');
});
