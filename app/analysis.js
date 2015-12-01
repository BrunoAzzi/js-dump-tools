var clientFileName,
    xhttp = new XMLHttpRequest(),

    publishRelatory = function(){
        $('#date-range-slider-wrapper').addClass('hidden');
        $('#publish-report-button').addClass('hidden');
        $('#interval-wrapper').removeClass('hidden');
        console.log($('#interval-wrapper').attr("class"));

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

        $('#interval-wrapper').addClass("hidden");
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

        if (apiKey) {
            diff.apiKey = apiKey;
            diff.activationDate = activationDate;
            $("#api-key-input-wrapper").addClass("hidden");

            $("#client-title").text("Report of "+diff.apiKey);
            $(".the-client-file-input-label").text(diff.apiKey+" Dump");
            $(".the-platform-file-input-label").text(diff.platformName+" Dump");

            $("#client-file-chooser-wrapper").removeClass("hidden");
        } else {
            $("#api-key-input-group").addClass("has-error");
        }
    },

    editApiKey = function() {
        $("#api-key-input-wrapper").removeClass("hidden");
        $("#client-title-wrapper").addClass("hidden");
    }

    showInfo = function() {
        $("#platform-file-chooser-wrapper").addClass("hidden");
        $("#client-file-chooser-wrapper").addClass("hidden");
        $("#client-title-wrapper").removeClass("hidden");

        if($("#showBlackboard").val() === "Show info") $("#showBlackboard").val("Update")

        resetFilters();

        var platformDateInterval = filterByDateInterval(diff.platformDump.data, diff.clientDump.extentDays[0], diff.clientDump.extentDays[1]),
            clientDateInterval = filterByDateInterval(diff.clientDump.data, diff.clientDump.extentDays[0], diff.clientDump.extentDays[1]),
            groupedClientInterval = groupByOrders(clientDateInterval),
            groupedPlatformInterval = groupByOrders(platformDateInterval);

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
            orderResult = newIsOrderOk(result);

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
        $("#interval").text(moment(diff.clientDump.extentDays[0]).format('YYYY/MM/DD')+" to "+moment(diff.clientDump.extentDays[1]).format('YYYY/MM/DD'));

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
            clientTotal += summary[diff.apiKey];
            platformTotal += summary[diff.platformName];
        }

        diff.clientDump.amountTotal = clientTotal;
        diff.platformDump.amountTotal = platformTotal;
    },

    calculateDumpNumberOfTransactions = function(dump, groupedData) {
        dump.numberOfOrders = groupedData.length;
    },

    createDateSlider = function(minDate, maxDate) {
        var beginDate = new Date(minDate.year(), minDate.month(), minDate.date()),
            endDate = new Date(maxDate.year(), maxDate.month(), maxDate.date()),
            formattedBeginDate = beginDate.getDate()+"/"+(beginDate.getMonth()+1)+"/"+beginDate.getFullYear(),
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
                return days + "/" + month + "/" + year;
                // "+ hour + ":" + minute + ":" + second;
            },
            range:{
                min: {days: 2}
            },
            step: {days: 1}
        });

        $("#slider").bind("valuesChanged", function(e, data){
            diff.clientDump.extentDays[0] = data.values.min;
            diff.clientDump.extentDays[1] = data.values.max;
            console.log("Values just changed. min: " + diff.clientDump.extentDays[0] + " max: " + diff.clientDump.extentDays[1]);
        });
    };

$("#the-client-csv-file-input").change(function() {
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
            var filteredResult = result.data;
            if(diff.activationDate){
                filteredResult = filterResultByActivationDate(result.data, diff.activationDate);
            }
            setupClient(filteredResult);
            $("#platform-file-chooser-wrapper").removeClass("hidden");
            $("#client-csv-warning-tip").addClass("hidden");
            $("#client-csv-success-tip").removeClass("hidden");
            $("#client-csv-progress-bar").addClass("hidden");
            $("#client-json-tab").addClass("hidden");
        }
 });

  $("#client-csv-progress").attr('aria-valuenow','100');
  $("#client-csv-progress").css('width','100%');

});

$("#the-client-json-file-input").change(function() {
    var URL = window.URL || window.webkitURL ;
    var url = URL.createObjectURL(this.files[0]);
    var size = 0;

    diff.clientData = [];

    oboe(url)
    .done(function(things){
        var teste="";
        for(item of things.items) {
           diff.clientData.push({oid: things.id,
                uid: things.userId,
                timestamp: things.date,
                pid: item.product.id,
                sku: item.product.sku,
                price: +item.product.price,
                quantity: +item.quantity
            });
        }
        teste += JSON.stringify(things)+"\n";
        size += teste.length;

        if(size >= this.header('Content-Length') | size >= (this.header('Content-Length')-1)){
            var filteredResult = diff.clientData;
            if(diff.activationDate){
                filteredResult = filterResultByActivationDate(diff.clientData, diff.activationDate);
            }
            setupClient(filteredResult);
            $("#platform-file-chooser-wrapper").removeClass("hidden");
            $("#client-json-warning-tip").addClass("hidden");
            $("#client-json-success-tip").removeClass("hidden");
            $("#client-json-progress-bar").addClass("hidden");
            $("#client-csv-tab").addClass("hidden");
        }
    });

    $("#client-json-progress").attr('aria-valuenow','100');
    $("#client-json-progress").css('width','100%');
});

$("#the-platform-csv-file-input").change(function() {
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
      var filteredResult = result.data;
      if(diff.activationDate){
          filteredResult = filterResultByActivationDate(result.data, diff.activationDate);
      }
      setupPlatform(filteredResult);
      $("#date-range-slider-wrapper").removeClass("hidden");
      $("#platform-csv-warning-tip").addClass("hidden");
      $("#platform-csv-success-tip").removeClass("hidden");
      $("#platform-csv-progress-bar").addClass("hidden");
      $("#platform-json-tab").addClass("hidden");
      createDateSlider(diff.clientDump.extentDays[0], diff.clientDump.extentDays[1]);
    }
  });

  $("#platform-csv-progress").attr('aria-valuenow','100');
  $("#platform-csv-progress").css('width','100%');
});

$("#the-platform-json-file-input").change(function() {
    var URL = window.URL || window.webkitURL ;
    var url = URL.createObjectURL(this.files[0]);
    var size = 0;

    diff.clientData = [];

    oboe(url)
    .done(function(things){
        var teste="";
        for(item of things.items) {
           diff.clientData.push({oid: things.id,
                uid: things.userId,
                timestamp: things.date,
                pid: item.product.id,
                sku: item.product.sku,
                price: +item.product.price,
                quantity: +item.quantity
            });
            if(item.quantity) teste += ".0";
        }
        teste += JSON.stringify(things)+"\n";
        size += teste.length;

        if(size >= this.header('Content-Length') | size >= (this.header('Content-Length')-6)){
            var filteredResult = diff.clientData;
            if(diff.activationDate){
                filteredResult = filterResultByActivationDate(diff.clientData, diff.activationDate);
            }
            setupPlatform(filteredResult);
            $("#date-range-slider-wrapper").removeClass("hidden");
            $("#platform-json-warning-tip").addClass("hidden");
            $("#platform-json-success-tip").removeClass("hidden");
            $("#platform-json-progress-bar").addClass("hidden");
            $("#platform-csv-tab").addClass("hidden");
            createDateSlider(diff.clientDump.extentDays[0], diff.clientDump.extentDays[1]);
        }
    });
    $("#platform-json-progress").attr('aria-valuenow','100');
    $("#platform-json-progress").css('width','100%');
});

$('#activation-date-input').datetimepicker({
    format: 'YYYY-MM-DD',
    extraFormats: [ 'YYYY-MM-DD HH:mm:SS', moment.ISO_8601 ]
});
