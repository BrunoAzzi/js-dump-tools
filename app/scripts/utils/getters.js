function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

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

    // getOrdersDifference = function (groupedClientData, groupedPlatformData) {
    //     var clientOrders = groupedClientData.map(function (row){ return row.key; }),
    //         platformOrders = groupedPlatformData.map(function (row){ return row.key; }),
    //
    //         a = new Set(clientOrders),
    //         b = new Set(platformOrders),
    //
    //         clientDifference = new Set([...a].filter(x => !b.has(x))),
    //         platformDifference = new Set([...b].filter(x => !a.has(x)));
    //
    //     dumpTools.platform.aloneOrders = platformDifference;
    //     dumpTools.client.aloneOrders = clientDifference;
    // },
    //
    // getOrdersIntersection = function (groupedClientData, groupedPlatformData) {
    //     var clientOrders = groupedClientData.map(function (row){ return row.key; }),
    //         platformOrders = groupedPlatformData.map(function (row){ return row.key; }),
    //
    //         a = new Set(clientOrders),
    //         b = new Set(platformOrders),
    //
    //         intersection = new Set([...a].filter(x => b.has(x)));
    //
    //     return intersection;
    // };

    getOrdersDifference = function getOrdersDifference(groupedClientData, groupedPlatformData) {
    var clientOrders = groupedClientData.map(function (row) {
        return row.key;
    }),
        platformOrders = groupedPlatformData.map(function (row) {
        return row.key;
    }),
        a = new Set(clientOrders),
        b = new Set(platformOrders),
        clientDifference = new Set([].concat(_toConsumableArray(a)).filter(function (x) {
        return !b.has(x);
    })),
        platformDifference = new Set([].concat(_toConsumableArray(b)).filter(function (x) {
        return !a.has(x);
    }));

    dumpTools.platform.aloneOrders = platformDifference;
    dumpTools.client.aloneOrders = clientDifference;
},
    getOrdersIntersection = function getOrdersIntersection(groupedClientData, groupedPlatformData) {
    var clientOrders = groupedClientData.map(function (row) {
        return row.key;
    }),
        platformOrders = groupedPlatformData.map(function (row) {
        return row.key;
    }),
        a = new Set(clientOrders),
        b = new Set(platformOrders),
        intersection = new Set([].concat(_toConsumableArray(a)).filter(function (x) {
        return b.has(x);
    }));

    return intersection;
};
