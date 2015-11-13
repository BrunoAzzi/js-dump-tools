var getOrderById = function(oid, data){
        for(order of groupByOrders(data)){
            if(order.key == oid){
                return order;
            }
        }
    },

    getAllOrdersById = function(idData, data){
        var array = [];
        for(id of idData){
            array.push(getOrderById(id, data));
        }
        return array;
    },

    getOrdersDifference = function(clientData, platformData) {
        var clientOrders = groupByOrders(clientData).map(function(row){ return row.key; }),
            platformOrders = groupByOrders(platformData).map(function(row){ return row.key; }),

            a = new Set(clientOrders),
            b = new Set(platformOrders),

            clientDifference = new Set([...a].filter(x => !b.has(x))),
            platformDifference = new Set([...b].filter(x => !a.has(x)));

        diff.platformDump.onlyOrders = platformDifference;
        diff.clientDump.onlyOrders = clientDifference;
    },

    getOrdersIntersection = function(clientData, platformData) {
        var clientOrders = groupByOrders(clientData).map(function(row){ return row.key; }),
            platformOrders = groupByOrders(platformData).map(function(row){ return row.key; }),

            a = new Set(clientOrders),
            b = new Set(platformOrders),

            intersection = new Set([...a].filter(x => b.has(x)));

        return intersection;
    };
