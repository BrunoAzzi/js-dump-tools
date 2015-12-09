$("#the-platform-csv-file-input").change(function() {
    var file = this.files[0],
        activationDate = $("#activation-date-input").val(),
        config = {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            worker: true
        };

    parsePlatformCSVFile(file, activationDate, config);
});

$("#the-platform-json-file-input").change(function() {
    var file = this.files[0],
        activationDate = $("#activation-date-input").val(),
        URL = window.URL || window.webkitURL,
        fileUrl = URL.createObjectURL(this.files[0]);

    parsePlatformJSONFile(fileUrl, activationDate);
});
