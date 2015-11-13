var diffAmountsByDay = function(clientData, platformData) {
        innerClient = summarizeOrdersAmountsByDay(clientData);
        innerPlatform = summarizeOrdersAmountsByDay(platformData);

        var object = [];
        for (i = 0; i < innerClient.length; i++) {
            if (innerClient[i] && innerPlatform[i] && innerClient[i].date == innerPlatform[i].date) {
                object.push({
                    day : innerClient[i].key,
                    client: innerClient[i].values,
                    platform: innerPlatform[i].values
                });
            } else {
                //showBigWarning(client[i].date, platform[i].date);
                break;
            }
        }
        return object;
    },

    diffOrdersByDay = function(clientData, platformData) {
        var innerClient = summarizeOrdersByDay(clientData),
            innerPlatform = summarizeOrdersByDay(platformData),
            object = [];

        for (i = 0; i < innerClient.length; i++) {
            if (innerClient[i] && innerPlatform[i] && innerClient[i].date == innerPlatform[i].date) {
                object.push({
                    day : innerClient[i].date,
                    client: innerClient[i].data,
                    platform: innerPlatform[i].data
                });
            } else {
                //showBigWarning(client[i].date, platform[i].date);
                break;
            }
        }

        return object;
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
                        // console.log(month.values[i].values[i2].values[i3]);
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
    }
