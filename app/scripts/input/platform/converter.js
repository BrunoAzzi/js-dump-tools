var parsePlatformCSVFile = function (file, activationDate, parseConfiguration) {

            parseConfiguration.error = function (err, reason) {
                console.log(err, reason);
            };

            parseConfiguration.step = function (results) {
                dumpTools.platform.data.push(results.data[0]);
            }

            parseConfiguration.complete = function () {
                if(dumpTools.platform.data.length <= 0){
                    hideLoadingGif("platform", "csv");
                    cleanAlerts("platform", "csv");
                    showAlert("platform", "csv", "danger", "Invalid File!");
                } else {
                    var filteredResult = filterResultByActivationDate(dumpTools.platform.data, activationDate);

                    for (row of filteredResult) {
                        row.timestamp = moment(row.timestamp, ["YYYY-MM-DD HH:mm:ss"]);
                    }

                    dumpTools.platform = setupClient(filteredResult);

                    hideLoadingGif("platform", "csv");
                    hideTab("platform", "json");
                    cleanAlerts("platform", "csv");
                    showAlert("platform", "csv", "success", "Parse Complete.");
                    showDateSlider();
                }
            };
            resetInput("platform", "csv");
            showLoadingGif("platform", "csv");
            Papa.parse(file, parseConfiguration);
        },

    parsePlatformJSONFile = function (fileUrl, activationDate) {
        var size = 0,
            data = [];

        $("#platform-json-loading-gif").removeClass("hidden");

        if (window.Worker) {
	        var myWorker = new Worker("js/workers/jsonWorker.js");

	        myWorker.postMessage({
                fileUrl: fileUrl,
                context: "platform"
            });

        	myWorker.onmessage = function (event) {
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

                    filteredResult.forEach(function (row) { row.timestamp = moment(row.timestamp, ["YYYY-MM-DD HH:mm:ss"]); });
                    dumpTools.platform = setupPlatform(filteredResult);
                    showResults("json", "platform");
                    showDateSlider();
                }
            };

            myWorker.onerror = function (event) {
        		console.log('Message received from worker with error');
        	};
        }

        $("#platform-csv-tab").addClass("hidden");
    },

    setupPlatform = function (data) {
        return {
            data: data,
            name: dumpTools.platform.name,
            productsTotal: data.length
        }
    };
