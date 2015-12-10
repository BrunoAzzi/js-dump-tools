var dumpTools = {
        platform: {
            data: [],
            name: "Chaordic",
            amountOfOrders: 0,
            numberOfOrders: 0,
            numberOfProducts: 0,
            aloneOrders: []
        },
        client: {
            data: [],
            name: "Cliente",
            amountOfOrders: 0,
            numberOfOrders: 0,
            numberOfProducts: 0,
            aloneOrders: [],
            extentDays: []
        },
        tests: {
            results: [],
            summary: {
                errors: 0,
                warnings: 0,
                successes: 0
            }
        }
    },
    en = {
        "in": " in ",
        "difference": {
            "title": "Difference",
            "orders": "Difference of orders",
            "amount": "Difference of amount",
            "numberOfOrders": "Difference in number of orders",
            "amountOfOrders": "Difference in amount of Orders"
        },
        "orders": {
            "numberOfOrders": "Number of orders",
            "aloneOrders": "Alone orders",
            "amountOfOrders": "Amount of orders"
        },
        "aloneOrdersRepresentation": "Alone orders representation",
        "averageTicket": "Average ticket",
        "inconsistentOrdersInCommomOrders": "Inconsistent orders in commom orders",
        "alert": {
            "warning": " is close to the max percentage (Between 5% and 10%) - We need to take make some tests!",
            "error": " is above of the max percentage - The percentage is below of 10%!",
            "success": " is less than a half of the max percentage - We are Ok"
        }
    },
    ptBr = {
        "in": " em ",
        "difference": {
          "title": "Diferença",
          "orders": "Diferença de transações",
          "amount": "Diferença de valor",
          "numberOfOrders": "Diferença na quantidade das transações",
          "amountOfOrders": "Diferença no valor das transações"
        },
        "orders": {
          "numberOfOrders": "Número de transações",
          "aloneOrders": "Transações sozinhas",
          "amountOfOrders": "Valor das transações"
        },
        "aloneOrdersRepresentation": "Representação das transações sozinhas",
        "averageTicket": "Ticket médio",
        "inconsistentOrdersInCommomOrders": "Transações inconsistentes",
        "alert": {
          "warning": " está perto da porcentagem máxima (entre 5% e 10%) - Precisamos fazer mais testes!",
          "error": " está acima da porcentagem máxima - A porcentagem está acima de 10%!",
          "success": " é menos que a metade da porcentagem máxima - Estamos bem"
        }
    },
    lang = ptBr;

$(document).on('change', '.btn-file :file', function() {
  var input = $(this),
      numFiles = input.get(0).files ? input.get(0).files.length : 1,
      label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
  input.trigger('fileselect', [numFiles, label]);
});

$(document).ready( function() {
    $('.btn-file :file').on('fileselect', function(event, numFiles, label) {
        var input = $(this).parents('.input-group').find(':text'),
            log = label;

        if (input.length) {
            input.val(log);
        } else {
            if (log) alert(log);
        }
    });
});

$('#activation-date-input').datetimepicker({
    format: 'YYYY-MM-DD',
    extraFormats: [ 'YYYY-MM-DD HH:mm:SS', moment.ISO_8601 ]
});

"use strict";
var confirmApiKey = function () {
        var apiKey = $("#api-key-input").val();

        if (apiKey) {
            $("#api-key-input-wrapper").addClass("hidden");
            $("#client-file-chooser-wrapper").removeClass("hidden");
        } else {
            $("#api-key-input-group").addClass("has-error");
        }
    },

    createDateSlider = function (minDate, maxDate) {
        var beginDate = new Date(minDate.year(), minDate.month(), minDate.date()),
            endDate = new Date(maxDate.year(), maxDate.month(), maxDate.date()),
            formattedBeginDate = beginDate.getDate() + "/" + (beginDate.getMonth() + 1) + "/" + beginDate.getFullYear(),
            formattedEndDate = endDate.getDate() + "/" + (endDate.getMonth() + 1) + "/" + endDate.getFullYear();

        $("#beginDate").text(formattedBeginDate);
        $("#endDate").text(formattedEndDate);

        $("#slider").dateRangeSlider({
            arrows: false,
            bounds: {
                min: beginDate,
                max: endDate
            },
            defaultValues: {
                min: beginDate,
                max: endDate
            },
            formatter: function (val) {
                var days = val.getDate(),
                    month = val.getMonth() + 1,
                    year = val.getFullYear();
                return days + "/" + month + "/" + year;
                // "+ hour + ":" + minute + ":" + second;
            },
            range: {
                min: { days: 2 }
            },
            step: { days: 1 }
        });

        $("#slider").bind("valuesChanged", function (e, data) {
            dumpTools.client.extentDays[0] = data.values.min;
            dumpTools.client.extentDays[1] = data.values.max;
            console.log("Values just changed. min: " + dumpTools.client.extentDays[0] + " max: " + dumpTools.client.extentDays[1]);
        });
    },

    showDateSlider = function () {
        $("#date-range-slider-wrapper").removeClass("hidden");
        createDateSlider(dumpTools.client.extentDays[0], dumpTools.client.extentDays[1]);
    },

    showWarnings = function (errors) {
        for (i = 0; i < errors.length; i++) {
            console.log(errors[i]);
        }
    },

    showResults = function (parseType, context) {
        // if (errors) showWarnings(errors);

        $("#" + context + "-" + parseType + "-warning-tip").addClass("hidden");
        $("#" + context + "-" + parseType + "-loading-gif").addClass("hidden");
        $("#" + context + "-" + parseType + "-success-tip").removeClass("hidden");
    },

    showPlatformInput = function () {
        $("#platform-file-chooser-wrapper").removeClass("hidden");
    };

var checkMaxPercentage = function(value, tittle, lang){
        var object = {
            type: "",
            tittle: tittle,
            text: ""
        };

        if (value < 10) {
            if (value >= 5) {
                object.type = "warning";
                object.text = lang.alert.warning
            } else {
                object.type = "success";
                object.text = lang.alert.success
            }
        } else {
            object.type = "danger";
            object.text = lang.alert.error
        }

        return object;
    },

    hideInputs = function() {
        $("#platform-file-chooser-wrapper").addClass("hidden");
        $("#client-file-chooser-wrapper").addClass("hidden");
    },

    showClientTitle = function() {
        $("#client-title-wrapper").removeClass("hidden");
    },

    changeReportButtonToUpdate = function() {
        $("#showBlackboard").val("Update");
    },

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
        a.attr("download", "js-dump-report-"+dumpTools.client.name+"-"+now.getDate()+"/"+now.getMonth()+"/"+now.getFullYear()+".html");

        $('#interval-wrapper').addClass("hidden");
        $('#publish-report-button').removeClass('hidden');
        $('#date-range-slider-wrapper').removeClass('hidden');
    };

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

    $("#publish-report-button").removeClass("hidden");
    $("#interval").text(moment(dumpTools.client.extentDays[0]).format('YYYY/MM/DD')+" to "+moment(dumpTools.client.extentDays[1]).format('YYYY/MM/DD'));
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

var testOrder = function(clientOrders, platformOrders) {
        var obj = {
            client: {},
            platform: {},

        };

            obj.clientOrder = clientOrders;
            obj.platformOrder = platformOrders;
            obj.oid = clientOrders.key;

            obj.timestampPassed = true;
            obj.uidPassed = true;

            obj.productsPidPassed = true;
            obj.productsSkuPassed = true;
            obj.productsAmountPassed = true;

            isOrderUserIdAndTimestampValid(clientOrders, platformOrders, obj);
            // isOrderTimestampValid(clientOrders, platformOrders, obj);

            obj.clientProductsPassed = testProduct(clientOrders, platformOrders, obj);
            obj.platformProductsPassed = testProduct(platformOrders, clientOrders, obj);

            // testDuplicates(clientOrders)

        return obj;
    },

    isOrderUserIdAndTimestampValid = function(clientOrder, platformOrder, obj) {
        clientOrder.values.forEach( function (order) {
            platformOrder.values.forEach( function (innerOrder) {
                if (obj.timestampPassed) {
                    orderDay = order.timestamp.date();
                    clientRangeMax = moment(order.timestamp);
                    clientRangeMax.date(orderDay+1);
                    clientRangeMin = moment(order.timestamp);
                    clientRangeMin.date(orderDay-1)
                    if (!innerOrder.timestamp.isBetween(clientRangeMin, clientRangeMax)) obj.timestampPassed = false;
                }
                if (obj.uidPassed) {
                    if (order.uid != innerOrder.uid) obj.uidPassed = false;
                }
            });
        });
        // return true;
    },

    testProduct = function(reference, comparativeArray, teste) {
        var obj = [];
        var innerObj = {};

        reference.values.forEach( function (order) {
            innerObj = {
                pid: order.pid,
                sku: order.sku,
                pidPassed: false,
                skuPassed: false,
                pricePassed: false,
                quantityPassed: false
            };

            comparativeArray.values.forEach( function (innerOrder) {
                if (!innerObj.pidPassed) {
                    if (order.pid == innerOrder.pid && order.sku == innerOrder.sku){
                        innerObj.pidPassed = true;
                    }
                }

                // if (!innerObj.skuPassed) {
                //     if (order.sku == innerOrder.sku && innerObj.pidPassed){
                //         innerObj.skuPassed = true;
                //     }
                // }

                if (!innerObj.pricePassed) {
                    if (order.price == innerOrder.price && innerObj.pidPassed){
                        if (order.price > 0 && innerOrder.price > 0) {
                            innerObj.pricePassed = true;
                        }
                    }
                }

                if (!innerObj.quantityPassed) {
                    if (order.quantity == innerOrder.quantity && innerObj.pidPassed){
                        if (order.quantity > 0 && innerOrder.quantity > 0) {
                            innerObj.quantityPassed = true;
                        }
                    }
                }
            });

            if (!innerObj.pidPassed) {
                teste.productsPidPassed = false;
            }

            // if (!innerObj.skuPassed) {
            //     teste.productsSkuPassed = false;
            // }

            if (!innerObj.quantityPassed || !innerObj.pricePassed) {
                teste.productsAmountPassed = false;
            }

            obj.push(innerObj);
        });
        return obj;
    },

    isOrderOk = function(teste) {
        var retorno = -1;
        if (teste.timestampPassed && teste.uidPassed) {
            teste.clientProductsPassed.forEach( function (product) {
                if (product.pidPassed) {
                    if (product.pricePassed && product.quantityPassed) {
                        retorno = 1;
                    } else {
                        retorno = 0;
                    }
                } else {
                    return -1;
                }
            });
            teste.platformProductsPassed.forEach( function (product) {
                if (product.pidPassed) {
                    if (product.pricePassed && product.quantityPassed) {
                        if (retorno === 1) {
                            retorno = 1;
                        }
                    } else {
                        if (retorno > 0) {
                            retorno = 0;
                        }
                    }
                } else {
                    return -1;
                }
            });
        } else {
            retorno = -1;
        }
        return retorno;
    },

    newIsOrderOk = function(teste) {
        var retorno = -1;
        if (teste.timestampPassed && teste.uidPassed) {
            if(teste.productsPidPassed){
                if (teste.productsAmountPassed) {
                    retorno = 1;
                } else {
                    retorno = 0;
                }
            }
        }
        return retorno;
    }

    isProductOk = function(productTest) {
        if(productTest.pidPassed){
            if (productTest.pricePassed && productTest.quantityPassed) {
                return 1;
            } else {
                return 0;
            }
        } else {
            return -1;
        }
    },

    testDuplicates = function(products) {
        var results = [];
        for (var i = 0, len = products.length - 1; i < len; i++) {
            if((results.indexOf(arr[i]) == -1) && (arr.indexOf(arr[i], i + 1) != -1)) {
                results.push(arr[i]);
            }
        }
        return results;
    },

    hasDuplicatedValues = function(array) {
        array.sort(compareProductArray);
    };

var filterByDateInterval = function(data, beginDate, endDate) {
        return data.filter(function(row) {
            return row.timestamp.isBetween(beginDate, endDate, 'day');
            // || row.timestamp.isSame(beginDate, 'day') || row.timestamp.isSame(endDate, 'day');
        });
    },

    filterResultByActivationDate = function(data, activationDate) {
        if(!activationDate) return data;

        return data.filter( function(row) {
            var orderDate = row.timestamp.match("([0-9]{4}\-[0-9]{2}\-[0-9]{2})")[0],
                orderDateValues = orderDate.split("-"),
                orderYear = orderDateValues[0],
                orderMonth = orderDateValues[1],
                orderDay = orderDateValues[2];

            var activationDateValues = activationDate.split("-"),
                activationDateYear = activationDateValues[0],
                activationDateMonth = activationDateValues[1],
                activationDateDay = activationDateValues[2];

            if(orderYear >= activationDateYear){
                if(orderMonth >= activationDateMonth){
                    if(orderDay >= activationDateDay){
                        return true;
                    }
                }
            }

            return false;
        });
    };

var getOrderById = function (oid, groupedData) {
        for (order of groupedData) {
            if (order.key === oid) {
                return order;
            }
        }
    },

    getAllOrdersById = function (idData, groupedData) {
        var array = new Array();
        idData.forEach( function (id) {
            array.push(getOrderById(id, groupedData));
        });
        return array;
    },

    getOrdersFromIdArrayUsingMap = function (idArray, source) {
        var array = new Array();
        idArray.forEach( function (id) {
            array.push(getOrderById(id, source));
        });
        return array;
    },

    getOrdersDifference = function (groupedClientData, groupedPlatformData) {
        var clientOrders = groupedClientData.map(function (row){ return row.key; }),
            platformOrders = groupedPlatformData.map(function (row){ return row.key; }),

            a = new Set(clientOrders),
            b = new Set(platformOrders),

            clientDifference = new Set([...a].filter(x => !b.has(x))),
            platformDifference = new Set([...b].filter(x => !a.has(x)));

        dumpTools.platform.aloneOrders = platformDifference;
        dumpTools.client.aloneOrders = clientDifference;
    },

    getOrdersIntersection = function (groupedClientData, groupedPlatformData) {
        var clientOrders = groupedClientData.map(function (row){ return row.key; }),
            platformOrders = groupedPlatformData.map(function (row){ return row.key; }),

            a = new Set(clientOrders),
            b = new Set(platformOrders),

            intersection = new Set([...a].filter(x => b.has(x)));

        return intersection;
    };

var groupOrdersByDay = function(data) {
        return d3.nest()
            .key(function(d) { return d.timestamp.month()+1; })
            .key(function(d) { return d.timestamp.date(); })
            .key(function(d) { return d.oid; })
            .rollup(function(v) { return v; })
            .entries(data);
    },

    groupByOrders = function(data) {
        return d3.nest()
            .key(function(d) { return d.oid; })
            .entries(data);
    },

    groupByOrdersMap = function(data) {
        return d3.nest()
            .key(function(d) { return d.oid; })
            .map(data);
    }

var diffAmountsByDay = function (clientData, platformData) {
        var innerClient = summarizeOrdersAmountsByDay(clientData),
            innerPlatform = summarizeOrdersAmountsByDay(platformData),
            object = new Array();

        innerClient.forEach( function (clientRow) {
            object.push(diffOrdersAmountByDayHelper(clientRow, innerPlatform));
        });

        return object;
    },

    diffOrdersByDay = function (clientData, platformData) {
        var innerClient = summarizeOrdersByDay(clientData),
            innerPlatform = summarizeOrdersByDay(platformData),
            object = new Array();

        innerClient.forEach( function (clientRow) {
            object.push(diffOrdersByDayHelper(clientRow, innerPlatform));
        });

        return object;
    },

    diffOrdersByDayHelper = function (clientRow, innerPlatform) {
        innerObject = {
            day: clientRow.date,
            [dumpTools.client.name]: clientRow.data,
            [dumpTools.platform.name]: 0
        };
        innerPlatform.forEach( function (platformRow) {
            if(clientRow.date === platformRow.date){
                innerObject.day = clientRow.date;
                innerObject[dumpTools.client.name] = clientRow.data;
                innerObject[dumpTools.platform.name] = platformRow.data;
                return innerObject;
            }
        });
        return innerObject;
    },

    diffOrdersAmountByDayHelper = function (clientRow, innerPlatform) {
        innerObject = {
            day: clientRow.key,
            [dumpTools.client.name]: clientRow.values,
            [dumpTools.platform.name]: 0
        };

        innerPlatform.forEach( function (platformRow) {
            if(clientRow.key === platformRow.key){
                innerObject.day = clientRow.key;
                innerObject[dumpTools.client.name] = clientRow.values;
                innerObject[dumpTools.platform.name] = platformRow.values;
                return innerObject;
            }
        });
        return innerObject;
    },

    summarizeOrdersByDay = function (data) {
        innerData = groupOrdersByDay(data);

        var object = new Array();
        innerData.forEach( function (month)  {
            for (i = 0; i < month.values.length; i++) {
                object.push({
                    date : month.key+"-"+month.values[i].key,
                    data : month.values[i].values.length
                });
            }
        });
        return object;
    },

    summarizeOrdersAmountsByDay = function (data) {
        innerData = groupOrdersByDay(data);

        var object = new Array();
        innerData.forEach( function (month) {
            for (i = 0; i < month.values.length; i++) {
                for (var i2 = 0; i2 < month.values[i].values.length; i2++) {
                    for (var i3 = 0; i3 < month.values[i].values[i2].values.length; i3++) {
                        object.push({
                            date : month.key+"-"+month.values[i].key,
                            value : month.values[i].values[i2].values[i3].price * month.values[i].values[i2].values[i3].quantity
                        });
                    }
                }
            }
        });

        var expensesAvgAmount = d3.nest()
            .key(function (d) { return d.date; })
            .rollup(function (v) { return d3.sum(v, function (d) { return d.value; }); })
            .entries(object);

        return expensesAvgAmount;
    },

    formatCurrencyValue = function (value) {
        return numeral(value).format('$0,0.00');
    },

    formatIntegerValue = function (value) {
        return numeral(value).format('0,0');
    },

    compareProductArray = function (a, b) {
        var parsedA = parseInt(a.pid, 10),
            parsedB = parseInt(b.pid, 10);
        if (parsedA > 0 && parsedB > 0) {
            return compareNumber(parsedA, parsedB);
        } else {
            return naturalSort(a.pid, b.pid);
        }
    },

    compareNumber = function (a, b) {
        return a - b;
    },

    naturalSort = function (a, b) {
        function chunkify(t) {
            var tz = [], x = 0, y = -1, n = 0, i, j;

            while (i = (j = t.charAt(x++)).charCodeAt(0)) {
                var m = (i == 46 || (i >=48 && i <= 57));
                if (m !== n) {
                    tz[++y] = "";
                    n = m;
                }
                tz[y] += j;
            }
            return tz;
        }

        var aa = chunkify(a);
        var bb = chunkify(b);

        for (x = 0; aa[x] && bb[x]; x++) {
            if (aa[x] !== bb[x]) {
                var c = Number(aa[x]), d = Number(bb[x]);
                if (c == aa[x] && d == bb[x]) {
                    return c - d;
                } else {
                    return (aa[x] > bb[x]) ? 1 : -1;
                }
            }
        }
        return aa.length - bb.length;
    };

var parseClientCSVFile = function (file, activationDate, parseConfiguration) {

        parseConfiguration.error = function (err, reason) {
            console.log(err, reason);
        };

        parseConfiguration.step = function (row) {
            dumpTools.client.data.push(row.data[0]);
        };

        parseConfiguration.complete = function () {
            var filteredResult = filterResultByActivationDate(dumpTools.client.data, activationDate);

            for (row of filteredResult) { row.timestamp = moment(row.timestamp, ["YYYY-MM-DD HH:mm:ss"]); }
            dumpTools.client = setupClient(filteredResult);
            showResults("csv", "client");
            showPlatformInput();
        };

        $("#client-csv-loading-gif").removeClass("hidden");

        Papa.parse(file, parseConfiguration);

        $("#client-json-tab").addClass("hidden");
    },

    parseClientJSONFile = function (fileUrl, activationDate) {
        var data = [];

        $("#client-json-loading-gif").removeClass("hidden");

        if (window.Worker) {
            myWorker = new Worker("js/workers/jsonWorker.js");

            myWorker.postMessage({
                fileUrl: fileUrl,
                context: "client"
            });

            myWorker.onmessage = function (event) {
                var things = event.data;
                if (event.data.end) {
                    things = event.data.things;
                }

                things.items.forEach(function (item) {
                    data.push({
                        oid: things.id,
                        uid: things.userId,
                        timestamp: things.date,
                        pid: item.product.id,
                        sku: item.product.sku,
                        price: +item.product.price,
                        quantity: +item.quantity
                    });
                });

                if (event.data.end) {
                    filteredResult = filterResultByActivationDate(data, activationDate);

                    for (row of filteredResult) { row.timestamp = moment(row.timestamp, ["YYYY-MM-DD HH:mm:ss"]); }
                    dumpTools.client = setupClient(filteredResult);
                    showResults("json", "client");
                    showPlatformInput();
                }
            };

            myWorker.onerror = function (e) {
        		console.log('Message received from worker with error');
            };
        }

        $("#client-csv-tab").addClass("hidden");
    },

    setupClient = function (data) {
        var object = {
            data: data,
            name: $("#api-key-input").val(),
            productsTotal: data.length,
            extentDays: d3.extent(data, function (row) { return row.timestamp })
        };
        return object;
    };

$("#the-client-csv-file-input").change(function () {
    var file = this.files[0],
        activationDate = $("#activation-date-input").val(),
        config = {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            worker: true
        };
    parseClientCSVFile(file, activationDate, config);
});

$("#the-client-json-file-input").change(function () {
    var file = this.files[0],
        activationDate = $("#activation-date-input").val(),
        URL = window.URL || window.webkitURL,
        fileUrl = URL.createObjectURL(file);

    parseClientJSONFile(fileUrl, activationDate);
});

var parsePlatformCSVFile = function(file, activationDate, parseConfiguration) {

            parseConfiguration.error = function(err, reason){
                console.log(err, reason);
            };

            parseConfiguration.step = function(row) {
                dumpTools.platform.data.push(row.data[0]);
            }

            parseConfiguration.complete = function() {
                var filteredResult = filterResultByActivationDate(dumpTools.platform.data, activationDate);

                filteredResult.forEach( function(row) { row.timestamp = moment(row.timestamp, ["YYYY-MM-DD HH:mm:ss"]); });
                dumpTools.platform = setupPlatform(filteredResult);
                showResults("csv", "platform");
                showDateSlider();
            };

            $("#platform-csv-loading-gif").removeClass("hidden");

            Papa.parse(file, parseConfiguration);

            $("#platform-json-tab").addClass("hidden");
        },

    parsePlatformJSONFile = function(fileUrl, activationDate) {
        var size = 0,
            data = [];

        $("#platform-json-loading-gif").removeClass("hidden");

        if (window.Worker) {
	        var myWorker = new Worker("js/workers/jsonWorker.js");

	        myWorker.postMessage({
                fileUrl: fileUrl,
                context: "platform"
            });

        	myWorker.onmessage = function(event) {
                var things = event.data;
                if(event.data.end) things = event.data.things;

                things.items.forEach(function (item) {
                    data.push({oid: things.id,
                        uid: things.userId,
                        timestamp: things.date,
                        pid: item.product.id,
                        sku: item.product.sku,
                        price: +item.product.price,
                        quantity: +item.quantity
                    });
                });

                if(event.data.end){
                    var filteredResult = filterResultByActivationDate(data, activationDate);

                    filteredResult.forEach( function(row) { row.timestamp = moment(row.timestamp, ["YYYY-MM-DD HH:mm:ss"]); });
                    dumpTools.platform = setupPlatform(filteredResult);
                    showResults("json", "platform");
                    showDateSlider();
                }
            };

            myWorker.onerror = function(e) {
        		console.log('Message received from worker with error');
        	};
        }

        $("#platform-csv-tab").addClass("hidden");
    },

    setupPlatform = function(data) {
        return {
            data: data,
            name: dumpTools.platform.name,
            productsTotal: data.length
        }
    };

$("#the-platform-csv-file-input").change(function() {
    var file = this.files[0],
        activationDate = $("#activation-date-input").val(),
        config = {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            worker: true
        };

    parsePlatformCSVFile(file, activationDate, config);
});

$("#the-platform-json-file-input").change(function() {
    var file = this.files[0],
        activationDate = $("#activation-date-input").val(),
        URL = window.URL || window.webkitURL,
        fileUrl = URL.createObjectURL(this.files[0]);

    parsePlatformJSONFile(fileUrl, activationDate);
});

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

var reusableDiffChart = function(preparedData, title) {

    $("#charts").append("<h4>"+title+"</h4>");

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 992 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,

        x0 = d3.scale.ordinal()
            .rangeRoundBands([0, width], .3),

        x1 = d3.scale.ordinal()
            .rangeRoundBands([0, width]),

        y = d3.scale.linear()
            .range([height, 0]),

        color = d3.scale.ordinal()
            .range(["#2f7ed7", "#0d2339", "#793091", "#d8192c", "#9aca40", "#ffa269"]),

        xAxis = d3.svg.axis()
            .scale(x0)
            .orient("bottom"),

        yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(d3.format(".2s")),

        svg = d3.select("#charts")
            .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")"),

        ageNames = d3.keys(preparedData[0]).filter(function(key) { return key !== "day"; });

    preparedData.forEach(function(d) {
        d.ages = ageNames.map(function(name) { return {name: name, value: +d[name]}; });
    });

    x0.domain(preparedData.map(function(d) { return d.day; }));
    x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()], .3);
    y.domain([0, d3.max(preparedData, function(d) { return d3.max(d.ages, function(d) { return d.value; }); })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
        .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Value");

    var state = svg.selectAll(".state")
            .data(preparedData)
        .enter().append("g")
            .attr("class", "g")
            .attr("transform", function(d) { return "translate(" + x0(d.day) + ",0)"; });

    state.selectAll("rect")
            .data(function(d) { return d.ages; })
        .enter().append("rect")
            .attr("width", x1.rangeBand())
            .attr("x", function(d) { return x1(d.name); })
            .attr("y", function(d) { return y(d.value); })
            .attr("height", function(d) { return height - y(d.value); })
            .style("fill", function(d) { return color(d.name); });

    var legend = svg.selectAll(".legend")
            .data(ageNames.slice())
        .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });
}

var createClientAloneOrdersReport = function(data) {
        dust.render("report/orders/alone/orderPanel.dust", {order: data}, function(err, out) {
            $("#OrderOnlyClientReport").empty();
            $("#orders-only-in-client-header").text("Orders only in "+dumpTools.client.name+" - "+data.length);
            $("#OrderOnlyClientReport").append(out);
        });
    };

var createTestedOrdersResultReport = function(tests) {
            var config = {
                tests: tests,
                platformName: dumpTools.platform.name,
                clientName: dumpTools.client.name,
                checkSuccess: checkSuccess,
                productsTestResults: productsTestResults,
                newIsOrderOkDust: IsOrderOkDust,
                isProductOkDust: isProductOkDust
            };

            dust.render("report/orders/common/orderPanel.dust", config, function(err, out) {
                $("#tested-orders-result").empty();
                $("#accordion-test-results-header").text("Common Orders - "+
                    formatIntegerValue(dumpTools.tests.summary.errors)+" Errors - "+
                    formatIntegerValue(dumpTools.tests.summary.warnings)+" Warnings - "+
                    formatIntegerValue(dumpTools.tests.summary.successes)+" Success");
                $("#tested-orders-result").append(out);
            });
        },

    checkSuccess = function(chunk, context, bodies, params){
        var value = dust.helpers.tap(params.value, chunk, context);
        if(value === true || value > 0) return "success";
        if(value === false || value < 0) return "danger";
        if(value === 0) return "warning";
    },

    productsTestResults = function(teste) {
        var result = "";

        if (!teste.uidPassed) result += "<span class='label label-danger'><span class='glyphicon glyphicon-user'></span>User</span>";
        if (!teste.timestampPassed) result += "<span class='label label-danger'><span class='glyphicon glyphicon-calendar'></span>Timestamp</span>";
        if (!teste.productsPidPassed){
            result += "<span class='label label-danger'><span class='glyphicon glyphicon-shopping-cart'></span>Product</span>";
            return result;
        }
        if (!teste.productsSkuPassed) result += "<span class='label label-warning'><span class='glyphicon glyphicon-tag'></span>Sku</span>";
        if (!teste.productsAmountPassed) result += "<span class='label label-warning'><span class='glyphicon glyphicon-usd'></span>Price/Quantity</span>";

        return result;
    };

var toggleErrors = function() {
        var self = $("#error-filter");
        if (self.hasClass("label-danger")){
            self.removeClass("label-danger");
            self.addClass("label-default");
        } else {
            self.removeClass("label-default");
            self.addClass("label-danger");
        }
        if (dumpTools.tests.summary.errors === 0) return false;
        $("#tested-orders-result > div").each(function() {
            var self = $(this);
            if(self.hasClass("panel-danger")){
                if(self.hasClass("hidden")){
                    self.removeClass("hidden");
                } else {
                    self.addClass("hidden");
                }
            }
        });
    },

    toggleWarnings = function() {
        var self = $("#warning-filter");
        if (self.hasClass("label-warning")){
            self.removeClass("label-warning");
            self.addClass("label-default");
        } else {
            self.removeClass("label-default");
            self.addClass("label-warning");
        }
        if (dumpTools.tests.summary.warnings === 0) return false;
        $("#tested-orders-result > div").each(function() {
            var self = $(this);
            if(self.hasClass("panel-warning")){
                if(self.hasClass("hidden")){
                    self.removeClass("hidden");
                } else {
                    self.addClass("hidden");
                }
            }
        });
    },

    toggleSuccess = function() {
        var self = $("#success-filter");
        if (self.hasClass("label-success")){
            self.removeClass("label-success");
            self.addClass("label-default");
        } else {
            self.removeClass("label-default");
            self.addClass("label-success");
        }
        if (dumpTools.tests.summary.successes === 0) return false;
        $("#tested-orders-result > div").each(function() {
            var self = $(this);
            if(self.hasClass("panel-success")){
                if(self.hasClass("hidden")){
                    self.removeClass("hidden");
                } else {
                    self.addClass("hidden");
                }
            }
        });
    },

    resetFilters = function() {
        var successFilter = $("#success-filter"),
            warningFilter = $("#warning-filter"),
            errorFilter = $("#error-filter");
        successFilter.attr("class","label label-success");
        warningFilter.attr("class","label label-warning");
        errorFilter.attr("class","label label-danger");
    };

var showAloneOrdersReport = function(groupedClientInterval, groupedPlatformInterval) {
        $("#alone-orders-report-wrapper").removeClass("hidden");
        createClientAloneOrdersReport(getAllOrdersById(dumpTools.client.aloneOrders, groupedClientInterval));
        createPlatformAloneOrdersReport(getAllOrdersById(dumpTools.platform.aloneOrders, groupedPlatformInterval));
    },

    showCommonOrdersTestResults = function(testResult) {
        createTestedOrdersResultReport(testResult);
    };

var createPlatformAloneOrdersReport = function(data) {
        dust.render("report/orders/alone/orderPanel.dust", {order: data}, function(err, out) {
            $("#OrderOnlyPlatformReport").empty();
            $("#orders-only-in-platform-header").text("Orders only in "+dumpTools.platform.name+" - "+data.length);
            $("#OrderOnlyPlatformReport").append(out);
        });
    };

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

var IsOrderOkDust = function(chunk, context, bodies, params) {
    var teste = {
        timestampPassed: context.get("timestampPassed", true),
        uidPassed: context.get("uidPassed", true),
        // productsSkuPassed: context.get("productsSkuPassed", true),
        productsPidPassed: context.get("productsPidPassed", true),
        productsAmountPassed: context.get("productsAmountPassed", true)
    };
    var retorno = "danger";
    if (teste.timestampPassed && teste.uidPassed) {
        if(teste.productsPidPassed){
            if (teste.productsAmountPassed) {
                retorno = "success";
            } else {
                retorno = "warning";
            }
        }
    }
    return chunk.write(retorno);
},

isProductOkDust = function(chunk, context, bodies, params) {
    var object = "";
    var productTest = {
        // skuPassed: context.get("timestampPassed", true),
        pricePassed: context.get("uidPassed", true),
        quantityPassed: context.get("productsSkuPassed", true),
        pidPassed: context.get("productsPidPassed", true)
    };
    if(productTest.pidPassed){
        if (productTest.pricePassed && productTest.quantityPassed) {
            object = "success";
        } else {
            object = "warning";
        }
    } else {
        object = "danger";
    }
    return chunk.write(object);
};

dust.filters.formatCurrencyValue = function(value) {
    return numeral(value).format('$0,0.00');
},

dust.filters.formatIntegerValue = function(value) {
    return numeral(value).format('0,0');
},

dust.filters.formatDate = function(value) {
    return moment(value).format('YYYY-MM-DD HH:mm:SS');         
};
