var groupOrdersByDay = function(data) {
        return d3.nest()
            .key(function(d) { return d.timestamp.month()+1; })
            .key(function(d) { return d.timestamp.date(); })
            .key(function(d) { return d.oid; })
            .rollup(function(v) { return v; })
            .entries(data);
    },

    groupByOrders = function(data) {
        return d3.nest()
            .key(function(d) { return d.oid; })
            .entries(data);
    },

    groupByOrdersMap = function(data) {
        return d3.nest()
            .key(function(d) { return d.oid; })
            .map(data);
    }
