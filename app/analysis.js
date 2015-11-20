var diff = {},
    clientFileName,
    xhttp = new XMLHttpRequest(),

    publishRelatory = function(){
        $('#date-range-slider-wrapper').addClass('hidden');
        $('#publish-report-button').addClass('hidden');

        var createObjectURL = (window.URL || window.webkitURL || {}).createObjectURL || function(){};
        var blob = null;
        var content = document.documentElement.outerHTML;
        var mimeString = "application/octet-stream";
        window.BlobBuilder = window.BlobBuilder ||
                             window.WebKitBlobBuilder ||
                             window.MozBlobBuilder ||
                             window.MSBlobBuilder;


        if(window.BlobBuilder){
           var bb = new BlobBuilder();
           bb.append(content);
           blob = bb.getBlob(mimeString);
        }else{
           blob = new Blob([content], {type : mimeString});
        }

        var url = createObjectURL(blob);
        var now = new Date();
        var a = $("#publish-report-button");
        a.attr("href", url);
        a.attr("download", "js-dump-report-"+diff.apiKey+"-"+now.getDate()+"/"+now.getMonth()+"/"+now.getFullYear()+".html");

        $('#publish-report-button').removeClass('hidden');
        $('#date-range-slider-wrapper').removeClass('hidden');
    },

    prepareReport = function() {
        $('#publish-report-button').addClass('hidden');
        $('#date-range-slider-wrapper').addClass('hidden');
    },

    showResponse = function() {
        $('#publish-report-button').removeClass('hidden');
        $('#date-range-slider-wrapper').removeClass('hidden');
    }

    utf8_to_b64 = function(str) {
        return window.btoa(unescape(encodeURIComponent( str )));
    },

    confirmApiKey = function() {
        var apiKey = $("#api-key-input").val();
        var activationDate = $("#activation-date-input").val();

        if (apiKey && activationDate) {
            diff.apiKey = apiKey;
            diff.activationDate = activationDate;
            $("#api-key-input-wrapper").addClass("hidden");

            $("#client-title").text("Report of "+diff.apiKey);
            $("#client-title-wrapper").removeClass("hidden");

            $("#client-file-chooser-wrapper").removeClass("hidden");
        } else {
            if(apiKey){
                $("#activation-date-form-group").removeClass("has-error");
                $("#api-key-form-group").addClass("has-success");
            } else {
                $("#activation-date-form-group").removeClass("has-success");
                $("#api-key-form-group").addClass("has-error");
            }
            if(activationDate){
                $("#activation-date-form-group").removeClass("has-error");
                $("#activation-date-form-group").addClass("has-success");
            } else {
                $("#activation-date-form-group").removeClass("has-success");
                $("#activation-date-form-group").addClass("has-error");
            }
        }
    },

    editApiKey = function() {
        $("#api-key-input-wrapper").removeClass("hidden");
        $("#client-title-wrapper").addClass("hidden");
    }

    showInfo = function() {
        $("#platform-file-chooser-wrapper").addClass("hidden");
        $("#client-file-chooser-wrapper").addClass("hidden");

        var platformDateInterval = filterByDateInterval(diff.platformDump.data, diff.clientDump.extentDays[0], diff.clientDump.extentDays[1]),
            clientDateInterval = filterByDateInterval(diff.clientDump.data, diff.clientDump.extentDays[0], diff.clientDump.extentDays[1]),
            groupedClientInterval = groupByOrders(clientDateInterval),
            groupedPlatformInterval = groupByOrders(platformDateInterval),
            teste = {};

        diff.inconsistentOrders = 0;

        teste.results = []
        teste.errorOrders = 0;
        teste.warningOrders = 0;
        teste.successOrders = 0;

        showCharts(clientDateInterval, platformDateInterval);

        caculateAmountTotals(clientDateInterval, platformDateInterval);

        calculateDumpNumberOfTransactions(diff.clientDump, groupedClientInterval);
        calculateDumpNumberOfTransactions(diff.platformDump, groupedPlatformInterval);

        getOrdersDifference(groupedClientInterval, groupedPlatformInterval);

        for(orderId of getOrdersIntersection(groupedClientInterval, groupedPlatformInterval)){

            var clientOrder = getOrderById(orderId, groupedClientInterval);
            var platformOrder = getOrderById(orderId, groupedPlatformInterval);

            result = testOrder(clientOrder, platformOrder);
            // console.log(result);
            orderResult = isOrderOk(result);

            if(orderResult < 0) teste.errorOrders++;
            if(orderResult == 0) teste.warningOrders++;
            if(orderResult > 0) teste.successOrders++;

            teste.results.push(result);
        }
        console.log(teste);

        diff.inconsistentOrders = teste.errorOrders;

        showReport(diff.clientDump, diff.platformDump);

        createClientOnlyOrdersReport(getAllOrdersById(diff.clientDump.onlyOrders, groupedClientInterval));
        createPlatformOnlyOrdersReport(getAllOrdersById(diff.platformDump.onlyOrders, groupedPlatformInterval));
        createTestedOrdersResultReport(teste);

        $("#order-only-on-client").removeClass("hidden");
        $("#report-progress").attr('aria-valuenow','100');
        $("#report-progress").css('width','100%');
        $("#report-progress-bar").addClass("hidden");
        $("#publish-report-button").removeClass("hidden");


    },

    setupPlatform = function(data) {
        data.forEach(function(row) {
            row.timestamp = moment(row.timestamp, ["YYYY-MM-DD HH:mm:ss"]);
        });

        diff.platformDump = makeDump(data);
    },

    setupClient = function(data) {
        data.forEach(function(row) {
            row.timestamp = moment(row.timestamp, ["YYYY-MM-DD HH:mm:ss"]);
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

    calculateDumpNumberOfTransactions = function(dump, groupedData) {
        dump.numberOfOrders = groupedData.length;
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
            var filteredResult = filterResultByActivationDate(result.data, diff.activationDate);
            setupClient(filteredResult);
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
      var filteredResult = filterResultByActivationDate(result.data, diff.activationDate);
      setupPlatform(filteredResult);
      $("#date-range-slider-wrapper").removeClass("hidden");
      $("#platform-warning-tip").addClass("hidden");
      $("#platform-success-tip").removeClass("hidden");
      $("#platform-progress-bar").addClass("hidden");
      createDateSlider(diff.clientDump.extentDays[0], diff.clientDump.extentDays[1]);
    }
  });

  $("#platform-progress").attr('aria-valuenow','100');
  $("#platform-progress").css('width','100%');
});

$('#activation-date-input').datetimepicker({
    format: 'YYYY-MM-DD',
    extraFormats: [ 'YYYY-MM-DD HH:mm:SS', moment.ISO_8601 ]
});
