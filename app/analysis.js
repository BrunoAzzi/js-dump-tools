var MISSING_QUOTES = "MissingQuotes";
var URL = window.URL || window.webkitURL;
var diff = {};

$("#the-client-file-input").change(function() {

  if(this.files[0]) {
    if(URL){
      var fileUrl = URL.createObjectURL(this.files[0]);
    }
  }

  var psv = d3.dsv(";", "text/plain");

  psv(fileUrl, function(row) {
      return {
        oid: +row.oid,
        uid: +row.uid,
        pid: +row.pid,
        sku: +row.sku,
        price: +row.price,
        quantity: +row.quantity,
        //Check if locale need to be changed
        timestamp: moment.utc(row.timestamp, ["YYYY-MM-DD HH:mm:SS", moment.ISO_8601])
      };
    }, function(data) {
      diff.clientData = data;
    }
  );

  $("#report-progress").attr('aria-valuenow','33');
  $("#report-progress").css('width','33%');
});

$("#the-platform-file-input").change(function() {
  if(this.files[0]) {
    if(URL){
      var fileUrl = URL.createObjectURL(this.files[0]);
    }
  }

  var psv = d3.dsv(";", "text/plain");

  psv(fileUrl, function(row) {
      return {
        oid: +row.oid,
        uid: +row.uid,
        pid: +row.pid,
        sku: +row.sku,
        price: +row.price,
        quantity: +row.quantity,
        //Check if locale need to be changed
        timestamp: new Date(row.timestamp)
      };
    }, function(data) {
      diff.platformData = data;
    }
  );

  $("#report-progress").attr('aria-valuenow','66');
  $("#report-progress").css('width','66%');
});

function showInfo(){

  var clientDataByOrder = d3.nest().key(function(d) { return d.oid; }).entries(diff.clientData);

  // $("#report-progress").attr('aria-valuenow','12.5');
  // $("#report-progress").css('width','12.5%');

  var clientDataByDay = d3.nest().key(function(d) { return new Date(d.timestamp).getDate(); }).entries(diff.clientData);

  var extentDays = d3.extent(diff.clientData, function(row) { return row.timestamp });

  var platformDataByOrder = d3.nest().key(function(d) { return d.oid; }).entries(diff.platformData);

  var platformDataByDay = d3.nest().key(function(d) { return d.timestamp; }).entries(diff.platformData);

  var platformDateInterval = diff.platformData.filter(function(d) { return d.timestamp > extentDays[0] && d.timestamp < extentDays[1]; });

  var platformDateIntervalByOrder = d3.nest().key(function(d) { return d.oid; }).entries(platformDateInterval);

  searchInconsistentOrders(diff.clientDataByOrder, diff.platformDataByOrder);

  // console.log(clientDateInterval);

  // console.log(testeTimestamp);

  // console.log(clientDataByDay);

  $("#blackboard").append(
    "<h3> Client Data </h3>"+
    "<p>Number of Rows: "+diff.clientData.length+"<p>"+
    "<p>Number of Orders: "+clientDataByOrder.length+"<p>"+
    "<p>Max Day: "+extentDays[1].toISOString()+"<p>"+
    "<p>Min Day: "+extentDays[0].toISOString()+"<p>"+
    // "<p>Number of Days: "+clientDataByDay.length+"<p>"+
    "<h3> Platform Data </h3>"+
    "<p>Number of Rows: "+diff.platformData.length+"<p>"+
    "<p>Number of Orders: "+platformDataByOrder.length+"<p>"+
    "<p>Number of Orders(filtered by client days): "+platformDateIntervalByOrder.length+"<p>"+
    // "<p>Number of Days: "+platformDataByDay.length+"<p>"
    "<h3> Report </h3>"+
    "<p> In the same interval, "+(platformDateIntervalByOrder.length > clientDataByOrder.length ? "platform" : "client")+" has "+Math.abs(platformDateIntervalByOrder.length-clientDataByOrder.length)+" more orders </p>"+

    ""
  );

  $("#report-progress").attr('aria-valuenow','100');
  $("#report-progress").css('width','100%');
}

function searchInconsistentOrders(clientOrders, platformOrders){
  //clientOrders.forEach();
}
