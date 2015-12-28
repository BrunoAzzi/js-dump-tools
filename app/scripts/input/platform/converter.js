var parsePlatformCSVFile = function (file, activationDate, parseConfiguration) {

        parseConfiguration.error = function (err, reason) {
            console.log(err, reason);
        };

        parseConfiguration.step = function (results) {
            if (results.meta && results.meta.fields) {
                var correctHeaders = ["oid", "uid", "pid", "sku", "price", "quantity", "timestamp"];
                var intersection = results.meta.fields.intersection(correctHeaders);
                if (intersection.size < correctHeaders.length) {
                    var difference  = correctHeaders.difference(intersection);
                    showAlert("platform", "csv", "danger", "The header(s) " + difference.print() + "is/are missing!");
                    parser.abort();
                }
            }
            dumpTools.platform.data.push(results.data[0]);
        }

        parseConfiguration.complete = function () {
            if(dumpTools.platform.data.length <= 0){
                hideLoadingGif("platform", "csv");
                showAlert("platform", "csv", "danger", "Invalid File!");
            } else {
                var filteredResult = filterResultByActivationDate(dumpTools.platform.data, activationDate);

                for (row of filteredResult) {
                    row.timestamp = moment(row.timestamp, ["YYYY-MM-DD HH:mm:ss"]);
                }

                dumpTools.platform = setupPlatform(filteredResult);

                hideLoadingGif("platform", "csv");
                hideTab("platform", "json");
                showAlert("platform", "csv", "success", "Parse Complete.");
                showDateSlider();
            }
        };
        resetInput("platform", "csv");

        if (file) {
            showLoadingGif("platform", "csv");
            cleanAlerts("platform", "csv");
            Papa.parse(file, parseConfiguration);
        }
    },

    parsePlatformJSONFile = function (fileUrl, activationDate) {
        var data = [];

        resetInput("platform", "json");

        if (window.Worker) {
	        var myWorker = new Worker("scripts/workers/jsonWorker.js");

            if (fileUrl) {
                showLoadingGif("platform", "json");

    	        myWorker.postMessage({
                    fileUrl: fileUrl,
                    context: "platform"
                });
            }

        	myWorker.onmessage = function (event) {
                if(event.data.error){
                    hideLoadingGif("platform", "json");
                    cleanAlerts("platform", "json");
                    showAlert("platform", "json", "danger", "Invalid File!");
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

                    if(event.data.end){
                        var filteredResult = filterResultByActivationDate(data, activationDate);

                        filteredResult.forEach(function (row) { row.timestamp = moment(row.timestamp, ["YYYY-MM-DD HH:mm:ss"]); });
                        dumpTools.platform = setupPlatform(filteredResult);
                        hideLoadingGif("platform", "json");
                        cleanAlerts("platform", "json");
                        showAlert("platform", "json", "success", "Parse complete.")
                        hideTab("platform", "csv");
                        showDateSlider();
                    }
                }
            };

            myWorker.onerror = function (event) {
        		console.log('Message received from worker with error');
        	};
        } else {
            console.log("Worker alternative");
        }
    },

    setupPlatform = function (data) {
        return {
            data: data,
            name: dumpTools.platform.name,
            productsTotal: data.length
        }
    };
