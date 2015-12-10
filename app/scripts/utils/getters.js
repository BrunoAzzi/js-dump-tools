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
