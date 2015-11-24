var diffAmountsByDay = function(clientData, platformData) {
        var innerClient = summarizeOrdersAmountsByDay(clientData),
            innerPlatform = summarizeOrdersAmountsByDay(platformData),
            object = [];

        for (clientRow of innerClient) {
            object.push(diffOrdersAmountByDayHelper(clientRow, innerPlatform));
        }

        return object;
    },

    diffOrdersByDay = function(clientData, platformData) {
        var innerClient = summarizeOrdersByDay(clientData),
            innerPlatform = summarizeOrdersByDay(platformData),
            object = [];

        for (clientRow of innerClient) {
            object.push(diffOrdersByDayHelper(clientRow, innerPlatform));
        }

        return object;
    },

    diffOrdersByDayHelper = function(clientRow, innerPlatform) {
        innerObject = {
            day: clientRow.date,
            // client: clientRow.data,
            // platform: 0
            [diff.apiKey]: clientRow.data,
            [diff.platformName]: 0
        };
        for (platformRow of innerPlatform) {
            if(clientRow.date === platformRow.date){
                innerObject.day = clientRow.date;
                // innerObject.client = clientRow.data;
                // innerObject.platform = platformRow.data;
                innerObject[diff.apiKey] = clientRow.data;
                innerObject[diff.platformName] = platformRow.data;
                return innerObject;
            }
        }
        return innerObject;
    },

    diffOrdersAmountByDayHelper = function(clientRow, innerPlatform) {
        innerObject = {
            day: clientRow.key,
            // client: clientRow.values,
            // platform: 0
            [diff.apiKey]: clientRow.values,
            [diff.platformName]: 0
        };

        for (platformRow of innerPlatform) {
            if(clientRow.key === platformRow.key){
                innerObject.day = clientRow.key;
                // innerObject.client = clientRow.values;
                // innerObject.platform = platformRow.values;
                innerObject[diff.apiKey] = clientRow.values;
                innerObject[diff.platformName] = platformRow.values;
                return innerObject;
            }
        }
        return innerObject;
    },

    summarizeOrdersByDay = function(data) {
        innerData = groupOrdersByDay(data);

        var object = [];
        for (month of innerData) {
            for (i = 0; i < month.values.length; i++) {
                object.push({
                    date : month.key+"-"+month.values[i].key,
                    data : month.values[i].values.length
                });
            }
        }
        return object;
    },

    summarizeOrdersAmountsByDay = function(data) {
        innerData = groupOrdersByDay(data);

        var object = [];
        for (month of innerData) {
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
        }

        var expensesAvgAmount = d3.nest()
            .key(function(d) { return d.date; })
            .rollup(function(v) { return d3.sum(v, function(d) { return d.value; }); })
            .entries(object);

        return expensesAvgAmount;
    },

    formatCurrencyValue = function(value) {
        return numeral(value).format('$0,0.00');
    },

    formatIntegerValue = function(value) {
        return numeral(value).format('0,0');
    }
