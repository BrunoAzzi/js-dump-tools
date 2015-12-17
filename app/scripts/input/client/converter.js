var parseClientCSVFile = function (file, activationDate, parseConfiguration) {

        parseConfiguration.error = function (err, reason) {
            console.log(err, reason);
        };

        parseConfiguration.step = function (results) {
            dumpTools.client.data.push(results.data[0]);
        };

        parseConfiguration.complete = function () {
            if(dumpTools.client.data.length <= 0){
                hideLoadingGif("client", "csv");
                cleanAlerts("client", "csv");
                showAlert("client", "csv", "danger", "Invalid File!");
            } else {
                var filteredResult = filterResultByActivationDate(dumpTools.client.data, activationDate);

                for (row of filteredResult) {
                    row.timestamp = moment(row.timestamp, ["YYYY-MM-DD HH:mm:ss"]);
                }

                dumpTools.client = setupClient(filteredResult);

                hideLoadingGif("client", "csv");
                hideTab("client", "json");
                cleanAlerts("client", "csv");
                showAlert("client", "csv", "success", "Parse Complete.");
                showPlatformInput();
            }
        };
        resetInput("client", "csv");
        
        if (file) {
            showLoadingGif("client", "csv");
            Papa.parse(file, parseConfiguration);
        }
    },

    parseClientJSONFile = function (fileUrl, activationDate) {
        var data = [];

        resetInput("client", "json");

        if (window.Worker) {
            var myWorker = new Worker("js/workers/jsonWorker.js");

            if (fileUrl) {
                showLoadingGif("client", "json");

                myWorker.postMessage({
                    fileUrl: fileUrl,
                    context: "client"
                });
            }

            myWorker.onmessage = function (event) {
                if(event.data.error){
                    hideLoadingGif("client", "json");
                    cleanAlerts("client", "json");
                    showAlert("client", "json", "danger", "Invalid File!");
                } else {
                    var things = event.data.things || {};

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
                        var filteredResult = filterResultByActivationDate(data, activationDate);

                        filteredResult.forEach(function (row) { row.timestamp = moment(row.timestamp, ["YYYY-MM-DD HH:mm:ss"]); });
                        dumpTools.client = setupClient(filteredResult);
                        hideLoadingGif("client", "json");
                        cleanAlerts("client", "json");
                        showAlert("client", "json", "success", "Parse complete.")
                        hideTab("client", "csv");
                        showPlatformInput();
                    }
                }
            };

            myWorker.onerror = function (e) {
        		console.log('Message received from worker with error');
            };
        } else {
            console.log("Worker alternative");
        }
    },

    setupClient = function (data) {
        return {
            data: data,
            name: $("#api-key-input").val(),
            productsTotal: data.length,
            extentDays: d3.extent(data, function (row) { return row.timestamp })
        };
    };
