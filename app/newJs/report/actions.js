var checkMaxPercentage = function(value, tittle, lang){
        var object = {
            type: "",
            tittle: tittle,
            text: ""
        }

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
        $("#showBlackboard").val("Update");
    };
