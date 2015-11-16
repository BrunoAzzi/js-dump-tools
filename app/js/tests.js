var testOrder = function(clientOrders, platformOrders) {
        var obj = {
            clientOrder: clientOrders,
            platformOrder: platformOrders,
            oid: clientOrders.key,
            uidPassed: isOrderUserIdValid(clientOrders, platformOrders),
            timestampPassed: isOrderTimestampValid(clientOrders, platformOrders),
            clientProductsPassed: testProduct(clientOrders, platformOrders),
            platformProductsPassed: testProduct(platformOrders, clientOrders),

        }
        return obj;
    },

    isOrderTimestampValid = function(clientOrder, platformOrder) {
        for (order of clientOrder.values) {
            for (innerOrder of platformOrder.values) {
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
        for (order of clientOrder.values) {
            for (innerOrder of platformOrder.values) {
                if (order.uid != innerOrder.uid) {
                    return false;
                }
            }
        }
        return true;
    },

    testProduct = function(reference, comparativeArray) {
        var obj = [];
        for (order of reference.values) {
            obj.push({
                pid: order.pid,
                pidPassed: isProductIdValid(order, comparativeArray),
                skuPassed: isProductSKUValid(order, comparativeArray),
                pricePassed: isProductPriceValid(order, comparativeArray),
                quantityPassed: isProductQuantityValid(order, comparativeArray)
            });
        }
        return obj;
    },

    isProductIdValid = function(order, comparativeArray) {
            for (innerOrder of comparativeArray.values) {
                if (order.pid == innerOrder.pid) {
                    return true;
                }
            }
        return false;
    },

    isProductSKUValid = function(reference, comparativeArray) {
            for (innerOrder of comparativeArray.values) {
                if (order.sku == innerOrder.sku && order.pid == innerOrder.pid) {
                    return true;
                }
            }
        return false;
    },

    isProductPriceValid = function(reference, comparativeArray) {
            for (innerOrder of comparativeArray.values) {
                if (order.price == innerOrder.price && order.pid == innerOrder.pid) {
                    if(order.price > 0 && innerOrder.price > 0){
                            return true;
                    }
                }
            }
        return false;
    },

    isProductQuantityValid = function(reference, comparativeArray) {
            for (innerOrder of comparativeArray.values) {
                if (order.quantity == innerOrder.quantity && order.pid == innerOrder.pid) {
                    if(order.quantity > 0 && innerOrder.quantity > 0){
                            return true;
                    }
                }
            }
        return false;
    },

    isOrderOk = function(teste) {
        var retorno = -1;
        if (teste.timestampPassed && teste.uidPassed) {
            for (product of teste.clientProductsPassed) {
                if (product.pidPassed) {
                    if (product.skuPassed && product.pricePassed && product.quantityPassed) {
                        retorno = 1;
                    } else {
                        retorno = 0;
                    }
                } else {
                    return -1;
                }
            }
            for (product of teste.platformProductsPassed) {
                if (product.pidPassed) {
                    if (product.skuPassed && product.pricePassed && product.quantityPassed) {
                        if (retorno === 1) {
                            retorno = 1;
                        }
                    } else {
                        if (retorno > 0) {
                            retorno = 0;
                        }
                    }
                } else {
                    return -1;
                }
            }
        } else {
            retorno = -1;
        }
        return retorno;
    },

    isProductOk = function(productTest) {
        if(productTest.pidPassed){
            if (productTest.skuPassed && productTest.pricePassed && productTest.quantityPassed) {
                return 1;
            } else {
                return 0;
            }
        } else {
            return -1;
        }
    };
