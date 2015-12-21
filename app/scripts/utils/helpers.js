function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

    // diffOrdersByDayHelper = function (clientRow, innerPlatform) {
    //     innerObject = {
    //         day: clientRow.date,
    //         [dumpTools.client.name]: clientRow.data,
    //         [dumpTools.platform.name]: 0
    //     };
    //     innerPlatform.forEach( function (platformRow) {
    //         if(clientRow.date === platformRow.date){
    //             innerObject.day = clientRow.date;
    //             innerObject[dumpTools.client.name] = clientRow.data;
    //             innerObject[dumpTools.platform.name] = platformRow.data;
    //             return innerObject;
    //         }
    //     });
    //     return innerObject;
    // },
    //
    // diffOrdersAmountByDayHelper = function (clientRow, innerPlatform) {
    //     innerObject = {
    //         day: clientRow.key,
    //         [dumpTools.client.name]: clientRow.values,
    //         [dumpTools.platform.name]: 0
    //     };
    //
    //     innerPlatform.forEach( function (platformRow) {
    //         if(clientRow.key === platformRow.key){
    //             innerObject.day = clientRow.key;
    //             innerObject[dumpTools.client.name] = clientRow.values;
    //             innerObject[dumpTools.platform.name] = platformRow.values;
    //             return innerObject;
    //         }
    //     });
    //     return innerObject;
    // },

    diffOrdersByDayHelper = function (clientRow, innerPlatform) {
        var _innerObject;

        innerObject = (_innerObject = {
            day: clientRow.date
        }, _defineProperty(_innerObject, dumpTools.client.name, clientRow.data), _defineProperty(_innerObject, dumpTools.platform.name, 0), _innerObject);
        innerPlatform.forEach(function (platformRow) {
            if (clientRow.date === platformRow.date) {
                innerObject.day = clientRow.date;
                innerObject[dumpTools.client.name] = clientRow.data;
                innerObject[dumpTools.platform.name] = platformRow.data;
                return innerObject;
            }
        });
        return innerObject;
    },

    diffOrdersAmountByDayHelper = function (clientRow, innerPlatform) {
        var _innerObject2;

        innerObject = (_innerObject2 = {
            day: clientRow.key
        }, _defineProperty(_innerObject2, dumpTools.client.name, clientRow.values), _defineProperty(_innerObject2, dumpTools.platform.name, 0), _innerObject2);

        innerPlatform.forEach(function (platformRow) {
            if (clientRow.key === platformRow.key) {
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

    Set.prototype.print = function () {
        var retorno = "";
        this.forEach(function (value) {
            retorno += value.toString()+", ";
        });

        return retorno;
    };
