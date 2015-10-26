
var MISSING_QUOTES = "MissingQuotes";
var URL = window.URL || window.webkitURL;

var clientDump, platformDump;

$("#the-client-file-input").change(function() {
  if(this.files[0]) {
    clientDump = new Dump(this.files[0]);
  }

  Papa.parse(clientDump.file, {
    header: true,
    dynamicTyping: true,

    error: function(err, reason) {
      console.log(err, reason);
    },

    complete: function(results) {
      if(results.errors.lenght > 0) {
        showErros(results.errors);
        return
      }
      console.log(results.data);
      var ds = new Miso.Dataset({
        data: results.data
      });

      fetchDataset(ds);
    }
  });
});

$("#the-platform-file-input").change(function() {
  if(this.files[0]) {
    platformDump = new Dump(this.files[0]);
  }

  Papa.parse(platformDump.file, {
    header: true,
    dynamicTyping: true,

    error: function(err, reason) {
      console.log(err, reason);
    },

    complete: function(results) {
      if(results.errors.lenght > 0) {
        showErros(results.errors);
        return
      }
      var ds = new Miso.Dataset( {
        data: results.data
      });

      fetchDataset(ds);
    }
  });
});

function Dump(dumpFile) {
  this.file = dumpFile;

  if (URL) {
    this.fileUrl = URL.createObjectURL(this.file);
  }

  this.getOrderCount = function() {
    return this.dataset.fetch( {
      success: function() {
        return this.groupBy('oid',['']).length;
      },
      error : function(e) {

      }
    });
  }

  console.log(this.file);
  console.log(this.fileUrl);

}

// NOT USED //
function showErros(errors) {
  for(var i = 0; i < errors.length; i++){
    if (errors[i].code == MISSING_QUOTES) {
      console.log(errors[i].message);
      console.log("Seu documento tem aspas, vá limpar essa merda!")
    }else {
      console.log(errors[i].message);
    }
  }
}

// DEPRECATED //
function createDataset(clientDumpUrl) {
  clientDataset = new Miso.Dataset({
      url : clientDumpUrl,
      delimiter : ";",
      columns : [
        { name : "oid", type : "number" },
        { name : "uid", type : "number" },
        { name : "pid", type : "number" },
        { name : "sku", type : "number" },
        { name : "price", type : "number", format : "YYYY" },
        { name : "price", type : "number", before : function(v) {
            // remove dollar signs and commas
            return v.replace(/\$|\,/g, '');
          }
        },
        { name : "quantity", type : "number"},
        { name : "timestamp", type : "time", format : "YYYY-MM-DD HH:mm:ss" }
      ]
  });
}

function fetchDataset(clientDataset) {

  clientDataset.fetch( {
    success : function() {

      console.log("Available columns: "+this.columnNames());
      console.log("Total rows: " + this.length);

      this.sort(function(rowA, rowB) {
        if (rowA.timestamp > rowB.timestamp) {
          return -1;
        }
        if (rowA.timestamp < rowB.timestamp) {
          return 1;
        }
        return 0;
      });

      console.log("==========================");
      console.log("After Sort", this.toJSON());
      console.log("Available columns: "+this.columnNames());
      console.log("There are " + this.length + " rows");

      var clientDataset1 = this.groupBy('oid',['pid']);

      console.log("==========================");
      console.log("After groupBy ordersId", clientDataset1.toJSON());
      console.log("Available columns: "+clientDataset1.columnNames());
      console.log("There are " + clientDataset1.length + " orders");
    }

  });
}
