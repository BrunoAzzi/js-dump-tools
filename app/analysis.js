var MISSING_QUOTES = "MissingQuotes";
var URL = window.URL || window.webkitURL;
var diff = {};
diff.clientData = [];

$("#the-client-file-input").change(function() {

  if(this.files[0]) {
    if(URL){
      var fileUrl = URL.createObjectURL(this.files[0]);
    }
  }

  //TODO criar um worker para isso
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
      diff.clientDump = makeDump(diff.clientData);
      diff.clientDump.extentDays = d3.extent(diff.clientData, function(row) { return row.timestamp });

      $("#platform-file-chooser-wrapper").removeClass("hidden");
      $("#warning-tip").addClass("hidden");
      $("#success-tip").removeClass("hidden");
      $("#client-progress-bar").addClass("hidden");
    }
  );

  $("#client-progress").attr('aria-valuenow','100');
  $("#client-progress").css('width','100%');

});

$("#the-platform-file-input").change(function() {
  if(this.files[0]) {
    if(URL){
      var fileUrl = URL.createObjectURL(this.files[0]);
    }
  }

  //TODO criar um worker para isso
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
      diff.platformData = data;
      data = data.filter(function(row){
        return row.timestamp.isBetween(diff.clientDump.extentDays[0], diff.clientDump.extentDays[1]);
      });
      diff.platformDump = makeDump(data);
      $("#report-board").removeClass("hidden");
      $("#platform-warning-tip").addClass("hidden");
      $("#platform-success-tip").removeClass("hidden");
      $("#platform-progress-bar").addClass("hidden");
    }
  );

  $("#platform-progress").attr('aria-valuenow','100');
  $("#platform-progress").css('width','100%');

});

function showInfo(){
  var platformDataByOrder = d3.nest().key(function(d) { return d.oid; }).entries(diff.platformData);
  var platformDataByDay = d3.nest().key(function(d) { return d.timestamp; }).entries(diff.platformData);
  var platformDateInterval = diff.platformData.filter(function(row) {
    return row.timestamp.isBetween(diff.clientDump.extentDays[0], diff.clientDump.extentDays[1]);
  });
  var platformDateIntervalByOrder = d3.nest().key(function(d) { return d.oid; }).entries(platformDateInterval);

  plot(transactionsByDay(diff.clientDump.productsByOrderByDate));

  $("#blackboard").append(
    "<h3> Client Data </h3>"+
    "<p>Number of Rows: "+diff.clientDump.numberOfRows+"<p>"+
    "<p>Number of Orders: "+diff.clientDump.numberOfTransactions+"<p>"+
    "<p>Number of Orders By Day: <p>"+
    returnString(diff.clientDump.productsByOrderByDate)+
    "<p>Max Day: "+diff.clientDump.extentDays[1].toISOString()+"<p>"+
    "<p>Min Day: "+diff.clientDump.extentDays[0].toISOString()+"<p>"+
    "<h3> Platform Data </h3>"+
    "<p>Number of Rows: "+diff.platformDump.numberOfRows+"<p>"+
    "<p>Number of Orders: "+diff.platformDump.numberOfTransactions+"<p>"+
    "<p>Number of Orders(filtered by client days): "+platformDateIntervalByOrder.length+"<p>"+
    "<p>Number of Orders By Day: <p>"+
    returnString(diff.platformDump.productsByOrderByDate)+
    ""
  );

  $("#report-progress").attr('aria-valuenow','100');
  $("#report-progress").css('width','100%');
  $("#report-progress-bar").addClass("hidden");
}

function makeDump(csvData, type){
  var dataGroupedByOrder = d3.nest().key(function(d) { return d.oid; }).entries(csvData);
  var productsByOrderByDate = d3.nest().key(function(d) { return d.timestamp.month(); })
    .key(function(d) { return d.timestamp.date(); })
    .key(function(d) { return d.oid; })
    .rollup(function(v) { return v.length; })
    .entries(csvData);

  var object = {
    data: csvData,
    type: type,
    numberOfRows: csvData.length,
    numberOfTransactions: dataGroupedByOrder.length,
    productsByOrderByDate: productsByOrderByDate
  }
  return object;
}

function returnString(data){
  var string = "";
  for (month of data) {
    for (day of month.values) {
      string += "<p>"+month.key+"-"+day.key+": "+day.values.length+"<p>";
    }
  }
  return string;
}

function transactionsByDay(data){
  var object = [];
  for (month of data) {
    for (i = 0; i < month.values.length; i++) {
      object.push({
        date : month.key+"-"+month.values[i].key,
        data : month.values[i].values.length
      });
    }
  }
  return object;
}

function plot(data){
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
    .range([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

  var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

x.domain(data.map(function(d) { return d.date; }));
y.domain([0, d3.max(data, function(d) { return d.data; })]);

svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);

svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("Day");

svg.selectAll(".bar")
  .data(data)
.enter().append("rect")
  .attr("class", "bar")
  .attr("x", function(d) { return x(d.date); })
  .attr("width", x.rangeBand())
  .attr("y", function(d) { return y(d.data); })
  .attr("height", function(d) { return height - y(d.data); });

}
