var diff = {};
// diff.platformData = [];
// diff.clientData = [];

$("#the-client-file-input").change(function() {
  Papa.parse(this.files[0], {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    // fastMode: true,
    // chunk: function(chunk){
    //   diff.clientData = diff.clientData.concat(chunk.data);
    // },
    error: function(err, reason) {
      console.log(err, reason);
    },
    complete: function(result) {
      if(result.errors){
        for (var i = 0; i < result.errors.length; i++) {
          console.log(result.errors[i]);
        }
      }
      setupClient(result.data);
      $("#platform-file-chooser-wrapper").removeClass("hidden");
      $("#client-warning-tip").addClass("hidden");
      $("#client-success-tip").removeClass("hidden");
      $("#client-progress-bar").addClass("hidden");
    }
  });

  $("#client-progress").attr('aria-valuenow','100');
  $("#client-progress").css('width','100%');

});

$("#the-platform-file-input").change(function() {
  Papa.parse(this.files[0], {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    // fastMode: true,
    // chunk: function(chunk){
    //   diff.platformData = diff.platformData.concat(chunk.data);
    // },
    error: function(err, reason) {
      console.log(err, reason);
    },
    complete: function(result) {
      if(result.errors){
        for (var i = 0; i < result.errors.length; i++) {
          console.log(result.errors[i]);
        }
      }
      setupPlatform(result.data);
      $("#report-board").removeClass("hidden");
      $("#platform-warning-tip").addClass("hidden");
      $("#platform-success-tip").removeClass("hidden");
      $("#platform-progress-bar").addClass("hidden");
      createDateSlider(diff.clientDump.extentDays[0], diff.clientDump.extentDays[1]);
    }
  });

  $("#platform-progress").attr('aria-valuenow','100');
  $("#platform-progress").css('width','100%');
});

function setupPlatform(data) {
  data.forEach(function(row) {
    row.timestamp = moment.utc(row.timestamp, ["YYYY-MM-DD HH:mm:SS"]);
  });

  diff.platformDump = makeDump(data);
}

function setupClient(data) {
  data.forEach(function(row) {
    row.timestamp = moment.utc(row.timestamp, ["YYYY-MM-DD HH:mm:SS"]);
  });

  diff.clientDump = makeDump(data);
  diff.clientDump.extentDays = d3.extent(data, function(row) { return row.timestamp });
}

function showInfo() {
  $("#platform-file-chooser-wrapper").addClass("hidden");
  $("#client-file-chooser-wrapper").addClass("hidden");

  var platformDateInterval = filterByDateInterval(diff.platformDump.data, diff.clientDump.extentDays[0], diff.clientDump.extentDays[1]);
  var clientDateInterval = filterByDateInterval(diff.clientDump.data, diff.clientDump.extentDays[0], diff.clientDump.extentDays[1]);

  numberOfOrderDiffPlot(clientDateInterval, platformDateInterval);

  calculateDumpNumberOfTransactions(diff.clientDump, platformDateInterval);
  calculateDumpNumberOfTransactions(diff.platformDump, clientDateInterval);

  showReport();

  $("#report-progress").attr('aria-valuenow','100');
  $("#report-progress").css('width','100%');
  $("#report-progress-bar").addClass("hidden");
}

function filterByDateInterval(data, beginDate, endDate){
  return data.filter(function(row) {
    return row.timestamp.isBetween(beginDate, endDate);
  });
}

function showReport(){
  $("#blackboard").append(
    "<div class='alert alert-info'>"+
    "<h3> Client Data </h3>"+
    "<p>Number of Rows: "+diff.clientDump.numberOfRows+"<p>"+
    "<p>Number of Orders: "+diff.clientDump.numberOfOrders+"<p>"+
    "<p>Max Day: "+diff.clientDump.extentDays[1].toString()+"<p>"+
    "<p>Min Day: "+diff.clientDump.extentDays[0].toString()+"<p>"+

    "<h3> Platform Data </h3>"+
    "<p>Number of Rows: "+diff.platformDump.numberOfRows+"<p>"+
    "<p>Number of Orders(filtered by client days interval): "+diff.platformDump.numberOfOrders+"<p>"+
    "</div>"+
    ""
  );
}

function makeDump(csvData) {
  var object = {
    data: csvData,
    numberOfRows: csvData.length,
  }
  return object;
}

function transactionsByDay(data) {
  innerData = filterOrderByDateInterval(data);

  var object = [];
  // if (array) {
  //   for (entry of array){
  //     object.push(entry);
  //   }
  // }
  for (month of innerData) {
    for (i = 0; i < month.values.length; i++) {
      object.push({
        date : month.key+"-"+month.values[i].key,
        data : month.values[i].values.length
      });
    }
  }
  return object;
}

function diffTransactionsByDay(client, platform) {
  innerClient = transactionsByDay(client);
  innerPlatform = transactionsByDay(platform);

  var object = [];
  for (i = 0; i < innerClient.length; i++) {
    if (innerClient[i] && innerPlatform[i] && innerClient[i].date == innerPlatform[i].date) {
      object.push({
        day : innerClient[i].date,
        platform: innerPlatform[i].data,
        client: innerClient[i].data,
      });
    } else {
      //showBigWarning(client[i].date, platform[i].date);
      break;
    }
  }
  return object;
}

function numberOfOrderDiffPlot(clientData, platformData) {
  innerData = diffTransactionsByDay(clientData, platformData);

  $("#chart-wrapper").removeClass("hidden");

  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = 992 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var x0 = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

  var x1 = d3.scale.ordinal();

  var y = d3.scale.linear()
      .range([height, 0]);

  var color = d3.scale.ordinal()
      .range(["#ffce54", "#3498db", "#ff8336", "#793091", "#d8192c", "#9aca40", "#ffa269"]);

  var xAxis = d3.svg.axis()
      .scale(x0)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickFormat(d3.format(".2s"));

  var svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var ageNames = d3.keys(innerData[0]).filter(function(key) { return key !== "day"; });

  innerData.forEach(function(d) {
    d.ages = ageNames.map(function(name) { return {name: name, value: +d[name]}; });
  });

  x0.domain(innerData.map(function(d) { return d.day; }));
  x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);
  y.domain([0, d3.max(innerData, function(d) { return d3.max(d.ages, function(d) { return d.value; }); })]);

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
      .text("Population");

  var state = svg.selectAll(".state")
      .data(innerData)
    .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x0(d.day) + ",0)"; });

  state.selectAll("rect")
      .data(function(d) { return d.ages; })
    .enter().append("rect")
      .attr("width", x1.rangeBand())
      .attr("x", function(d) { return x1(d.name); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .style("fill", function(d) { return color(d.name); });

  var legend = svg.selectAll(".legend")
      .data(ageNames.slice().reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });
}

function createDateSlider(minDate, maxDate) {
  console.log();
  $("#slider").dateRangeSlider({
    arrows: false,
    bounds:{
      min: minDate.toDate(),
      max: maxDate.toDate()
    },defaultValues:{
      min: minDate.toDate(),
      max: maxDate.toDate()
    },formatter:function(val){
      var days = val.getDate(),
      month = val.getMonth() + 1,
      year = val.getFullYear(),
      hour = val.getHours(),
      minute = val.getMinutes(),
      second = val.getSeconds();
      return days + "/" + month + "/" + year ;
    },range:{
      min: {days: 1}
    },step: {days: 1}
  });

  $("#slider").bind("valuesChanged", function(e, data){
    diff.clientDump.extentDays[0] = data.values.min;
    diff.clientDump.extentDays[1] = data.values.max;
    console.log("Values just changed. min: " + diff.clientDump.extentDays[0] + " max: " + diff.clientDump.extentDays[1]);
  });
}

function calculateDumpNumberOfTransactions(dump, data) {
  dump.numberOfOrders = d3.nest().key(function(d) { return d.oid; }).entries(data).length;
}

/* ======================= */

function filterOrderByDateInterval(data){
  return d3.nest().key(function(d) { return d.timestamp.month(); })
    .key(function(d) { return d.timestamp.date(); })
    .key(function(d) { return d.oid; })
    .rollup(function(v) { return v.length; })
    .entries(data);
}

function plot(data) {
  $("#chart-wrapper").removeClass("hidden");
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
