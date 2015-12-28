var checkMaxPercentage = function(value, tittle, lang){
        var object = {
            type: "",
            tittle: tittle,
            text: ""
        };

        if (value < 10) {
            if (value >= 5) {
                object.type = "warning";
                object.text = lang.alert.warning
            } else {
                object.type = "success";
                object.text = lang.alert.success
            }
        } else {
            object.type = "danger";
            object.text = lang.alert.error
        }

        return object;
    },

    hideInputs = function() {
        $("#platform-file-chooser-wrapper").addClass("hidden");
        $("#client-file-chooser-wrapper").addClass("hidden");
    },

    showClientTitle = function() {
        $("#client-title-wrapper").removeClass("hidden");
    },

    changeReportButtonToUpdate = function() {
        $("#showBlackboard").val(lang.buttons.update);
    },

    showDowloadButton = function () {
        $("#publish-report-button").text(lang.buttons.download);
        $("#publish-report-button").removeClass("hidden");
    },

    publishRelatory = function(){
        $('#date-range-slider-wrapper').addClass('hidden');
        $('#publish-report-button').addClass('hidden');
        $('#interval-wrapper').removeClass('hidden');

        var createObjectURL = (window.URL || window.webkitURL || {}).createObjectURL || function(){};
        var blob = null;
        var content = document.documentElement.outerHTML;
        var mimeString = "application/octet-stream";
        window.BlobBuilder = window.BlobBuilder ||
                             window.WebKitBlobBuilder ||
                             window.MozBlobBuilder ||
                             window.MSBlobBuilder;


        if(window.BlobBuilder){
           var bb = new BlobBuilder();
           bb.append(content);
           blob = bb.getBlob(mimeString);
        }else{
           blob = new Blob([content], {type : mimeString});
        }

        var url = createObjectURL(blob);
        var now = new Date();
        var a = $("#publish-report-button");
        a.attr("href", url);
        a.attr("download", "js-dump-report-"+dumpTools.client.name+"-"+now.getDate()+"/"+now.getMonth()+"/"+now.getFullYear()+".html");

        $('#interval-wrapper').addClass("hidden");
        $('#publish-report-button').removeClass('hidden');
        $('#date-range-slider-wrapper').removeClass('hidden');
    };
