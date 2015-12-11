importScripts('../scripts/test/tester.js');

onmessage = function(event) {

    result = testOrder(clientOrder, platformOrder);

    orderResult = newIsOrderOk(result);

    postMessage([result, orderResult]);

}
