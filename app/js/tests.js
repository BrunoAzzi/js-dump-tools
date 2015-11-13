var testOrder = function(clientOrders, platformOrders) {
        var obj = {
            clientOrder: clientOrders,
            platformOrder: platformOrders,
            oid: clientOrders.key,
            uid: isOrderUserIdValid(clientOrders, platformOrders),
            timestamp: isOrderTimestampValid(clientOrders, platformOrders),
            product : testProduct(clientOrders, platformOrders)
        }
        return obj;
    },

    isOrderTimestampValid = function(clientOrder, platformOrder) {
        for(order of clientOrder.values){
            for(innerOrder of platformOrder.values){
                orderDay = order.timestamp.date();
                clientRangeMax = moment(order.timestamp);
                clientRangeMax.date(orderDay+1);
                clientRangeMin = moment(order.timestamp);
                clientRangeMin.date(orderDay-1)
                if (!innerOrder.timestamp.isBetween(clientRangeMin, clientRangeMax)) {
                    return false;
                }
            }
        }
        return true;
    },

    isOrderUserIdValid = function(clientOrder, platformOrder) {
        for(order of clientOrder.values){
            for(innerOrder of platformOrder.values){
                if (order.uid != innerOrder.uid) {
                    return false;
                }
            }
        }
        return true;
    },

    testProduct = function(clientOrder, platformOrder) {
        var obj = [];
        for(order of clientOrder.values){
            obj.push({
                pid: isProductIdValid(clientOrder, platformOrder),
                sku: isProductSKUValid(clientOrder, platformOrder),
                price: isProductPriceValid(clientOrder, platformOrder),
                quantity: isProductQuantityValid(clientOrder, platformOrder)
            });
        }
        return obj;
    },

    isProductIdValid = function(clientOrder, platformOrder) {
        for(order of clientOrder.values){
            for(innerOrder of platformOrder.values){
                if (order.pid == innerOrder.pid) {
                    return true;
                }
            }
        }
        return false;
    },

    isProductSKUValid = function(clientOrder, platformOrder) {
        for(order of clientOrder.values){
            for(innerOrder of platformOrder.values){
                if (order.sku == innerOrder.sku && order.pid == innerOrder.pid) {
                    return true;
                }
            }
        }
        return false;
    },

    isProductPriceValid = function(clientOrder, platformOrder) {
        for(order of clientOrder.values){
            for(innerOrder of platformOrder.values){
                if (order.price == innerOrder.price && order.pid == innerOrder.pid) {
                    return true;
                }
            }
        }
        return false;
    },

    isProductQuantityValid = function(clientOrder, platformOrder) {
        for(order of clientOrder.values){
            for(innerOrder of platformOrder.values){
                if (order.quantity == innerOrder.quantity && order.pid == innerOrder.pid) {
                    return true;
                }
            }
        }
        return false;
    },

    isOrderOk = function(teste) {
        if (teste.timestamp && teste.uid) {
            for (product of teste.product) {
                if (product.id) {
                    if (teste.product.sku && teste.product.price && teste.product.quantity) {
                        return 1;
                    } else {
                        return 0;
                    }
                } else {
                    return -1;
                }
            }
        } else {
            return -1;
        }
    }
