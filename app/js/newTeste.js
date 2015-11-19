var testOrder = function(clientOrders, platformOrders) {
        var obj = {};

            obj.clientOrder = clientOrders;
            obj.platformOrder = platformOrders;
            obj.oid = clientOrders.key;

            obj.timestampPassed = true;
            obj.uidPassed = true;

            isOrderUserIdAndTimestampValid(clientOrders, platformOrders, obj);
            // isOrderTimestampValid(clientOrders, platformOrders, obj);

            obj.clientProductsPassed = testProduct(clientOrders, platformOrders);
            obj.platformProductsPassed = testProduct(platformOrders, clientOrders);

            // console.log(obj);

        return obj;
    },

    isOrderUserIdAndTimestampValid = function(clientOrder, platformOrder, obj) {
        for (order of clientOrder.values) {
            for (innerOrder of platformOrder.values) {
                if (obj.timestampPassed) {
                    orderDay = order.timestamp.date();
                    clientRangeMax = moment(order.timestamp);
                    clientRangeMax.date(orderDay+1);
                    clientRangeMin = moment(order.timestamp);
                    clientRangeMin.date(orderDay-1)
                    if (!innerOrder.timestamp.isBetween(clientRangeMin, clientRangeMax)) obj.timestampPassed = false;
                }
                if (obj.uidPassed) {
                    if (order.uid != innerOrder.uid) obj.uidPassed = false;
                }
            }
        }
        // return true;
    },

    testProduct = function(reference, comparativeArray) {
        var obj = [];
        var innerObj = {};

        for (order of reference.values) {
            innerObj = {};
            innerObj.pid = order.pid;
            innerObj.pidPassed = false;
            innerObj.skuPassed = false;
            innerObj.pricePassed = false;
            innerObj.quantityPassed = false;
            for(innerOrder of comparativeArray.values) {
                if (!innerObj.pidPassed) {
                    if (order.pid == innerOrder.pid) innerObj.pidPassed = true;
                }
                if (!innerObj.skuPassed) {
                    if (order.sku == innerOrder.sku && order.pid == innerOrder.pid) innerObj.skuPassed = true;
                }
                if (!innerObj.pricePassed) {
                    if (order.price == innerOrder.price && order.pid == innerOrder.pid){
                        if (order.price > 0 && innerOrder.price > 0) {
                            innerObj.pricePassed = true;
                        }
                    }
                }
                if (!innerObj.quantityPassed) {
                    if (order.quantity == innerOrder.quantity && order.pid == innerOrder.pid){
                        if (order.quantity > 0 && innerOrder.quantity > 0) {
                            innerObj.quantityPassed = true;
                        }
                    }
                }

            }
            obj.push(innerObj);
        }
        return obj;
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
