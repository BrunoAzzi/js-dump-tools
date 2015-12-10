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
