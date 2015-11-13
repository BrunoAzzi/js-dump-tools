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
    }
