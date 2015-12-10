var testOrder = function(clientOrders, platformOrders) {
        var obj = {
            clientOrder: clientOrders,
            platformOrder: platformOrders,
            oid: clientOrders.key,
            timestampPassed: true,
            uidPassed: true,
            productsPidPassed: true,
            productsSkuPassed: true,
            productsAmountPassed: true,
            hasDuplicatedValues: false
        };

        if (hasDuplicatedValues(clientOrders.values) || hasDuplicatedValues(platformOrders.values)) {
            obj.hasDuplicatedValues = true;
        }

        obj.clientProductsPassed = testProduct(clientOrders, platformOrders, obj);
        obj.platformProductsPassed = testProduct(platformOrders, clientOrders, obj);

        isOrderUserIdAndTimestampValid(clientOrders, platformOrders, obj);
        // isOrderTimestampValid(clientOrders, platformOrders, obj);
        return obj;
    },

    isOrderUserIdAndTimestampValid = function(clientOrder, platformOrder, obj) {
        clientOrder.values.forEach( function (order) {
            platformOrder.values.forEach( function (innerOrder) {
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
            });
        });
    },

    testProduct = function(reference, comparativeArray, teste) {
        var obj = [];
        var innerObj = {};

        reference.values.forEach( function (order) {
            innerObj = {
                pid: order.pid,
                sku: order.sku,
                pidPassed: false,
                skuPassed: false,
                pricePassed: false,
                quantityPassed: false
            };

            comparativeArray.values.forEach( function (innerOrder) {
                if (!innerObj.pidPassed) {
                    if (order.pid === innerOrder.pid && order.sku === innerOrder.sku){
                        innerObj.pidPassed = true;
                    }
                }

                // if (!innerObj.skuPassed) {
                //     if (order.sku == innerOrder.sku && innerObj.pidPassed){
                //         innerObj.skuPassed = true;
                //     }
                // }

                if (!innerObj.pricePassed) {
                    if (order.price === innerOrder.price && order.pid === innerOrder.pid && order.sku === innerOrder.sku){
                        if (order.price > 0 && innerOrder.price > 0) {
                            innerObj.pricePassed = true;
                        }
                    }
                }

                if (!innerObj.quantityPassed) {
                    if (order.quantity === innerOrder.quantity && order.pid === innerOrder.pid && order.sku === innerOrder.sku){
                        if (order.quantity > 0 && innerOrder.quantity > 0) {
                            innerObj.quantityPassed = true;
                        }
                    }
                }
            });

            if (!innerObj.pidPassed) {
                teste.productsPidPassed = false;
            }

            // if (!innerObj.skuPassed) {
            //     teste.productsSkuPassed = false;
            // }

            if (!innerObj.quantityPassed || !innerObj.pricePassed) {
                teste.productsAmountPassed = false;
            }

            obj.push(innerObj);
        });
        return obj;
    },

    isOrderOk = function(teste) {
        var retorno = -1;
        if (teste.timestampPassed && teste.uidPassed) {
            teste.clientProductsPassed.forEach( function (product) {
                if (product.pidPassed) {
                    if (product.pricePassed && product.quantityPassed) {
                        retorno = 1;
                    } else {
                        retorno = 0;
                    }
                } else {
                    return -1;
                }
            });
            teste.platformProductsPassed.forEach( function (product) {
                if (product.pidPassed) {
                    if (product.pricePassed && product.quantityPassed) {
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
            });
        } else {
            retorno = -1;
        }
        return retorno;
    },

    newIsOrderOk = function(teste) {
        var retorno = -1;
        if (teste.timestampPassed && teste.uidPassed) {
            if(teste.productsPidPassed){
                if (teste.productsAmountPassed) {
                    retorno = 1;
                } else {
                    retorno = 0;
                }
            }
        }
        return retorno;
    }

    isProductOk = function(productTest) {
        if(productTest.pidPassed){
            if (productTest.pricePassed && productTest.quantityPassed) {
                return 1;
            } else {
                return 0;
            }
        } else {
            return -1;
        }
    },

    testDuplicates = function(products) {
        var results = [];
        for (var i = 0, len = products.length - 1; i < len; i++) {
            if((results.indexOf(arr[i]) == -1) && (arr.indexOf(arr[i], i + 1) != -1)) {
                results.push(arr[i]);
            }
        }
        return results;
    },

    hasDuplicatedValues = function(array) {
        teste = array.sort(compareProductArray);
        var retorno = !isProductArrayUnique(teste.map(function(row){return row.oid + "" + row.sku}));
        debugger;
        return retorno;
    },

    isProductArrayUnique = function(array) {
        var uniq = [];
        var result = array.slice(0).every(function(item, index, arr) {
            if (uniq.indexOf(item) > -1) {
                arr.length = 0;
                return false;
            } else {
                uniq.push(item);
                return true;
            }
        });
        return result;
    };
