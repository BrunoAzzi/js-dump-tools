"use strict";
var confirmApiKey = function () {
        var apiKey = $("#api-key-input").val();

        if (apiKey) {
            $("#api-key-input-wrapper").addClass("hidden");
            $("#client-file-chooser-wrapper").removeClass("hidden");
        } else {
            $("#api-key-input-group").addClass("has-error");
        }
    },

    createDateSlider = function (minDate, maxDate) {
        var beginDate = new Date(minDate.year(), minDate.month(), minDate.date()),
            endDate = new Date(maxDate.year(), maxDate.month(), maxDate.date()),
            formattedBeginDate = beginDate.getDate() + "/" + (beginDate.getMonth() + 1) + "/" + beginDate.getFullYear(),
            formattedEndDate = endDate.getDate() + "/" + (endDate.getMonth() + 1) + "/" + endDate.getFullYear();

        $("#beginDate").text(formattedBeginDate);
        $("#endDate").text(formattedEndDate);

        $("#slider").dateRangeSlider({
            arrows: false,
            bounds: {
                min: beginDate,
                max: endDate
            },
            defaultValues: {
                min: beginDate,
                max: endDate
            },
            formatter: function (val) {
                var days = val.getDate(),
                    month = val.getMonth() + 1,
                    year = val.getFullYear();
                return days + "/" + month + "/" + year;
                // "+ hour + ":" + minute + ":" + second;
            },
            range: {
                min: { days: 2 }
            },
            step: { days: 1 }
        });

        $("#slider").bind("valuesChanged", function (e, data) {
            dumpTools.client.extentDays[0] = data.values.min;
            dumpTools.client.extentDays[1] = data.values.max;
            console.log("Values just changed. min: " + dumpTools.client.extentDays[0] + " max: " + dumpTools.client.extentDays[1]);
        });
    },

    showDateSlider = function () {
        $("#date-range-slider-wrapper").removeClass("hidden");
        $("#showBlackboard").attr("value",lang.buttons.showInfo);
        createDateSlider(dumpTools.client.extentDays[0], dumpTools.client.extentDays[1]);
    },

    showWarnings = function (errors) {
        for (i = 0; i < errors.length; i++) {
            console.log(errors[i]);
        }
    },

    showResults = function (parseType, context) {
        // if (errors) showWarnings(errors);

        $("#" + context + "-" + parseType + "-warning-tip").addClass("hidden");
        $("#" + context + "-" + parseType + "-loading-gif").addClass("hidden");
        $("#" + context + "-" + parseType + "-success-tip").removeClass("hidden");
    },

    showPlatformInput = function () {
        $("#platform-file-chooser-wrapper").removeClass("hidden");
    },

    showTab = function (context, name) {
        $("#" + context + "-" + name + "-tab").removeClass('hidden');
    },

    hideTab = function (context, name) {
        $("#" + context + "-" + name + "-tab").addClass('hidden');
    },

    showLoadingGif = function (context, name) {
        $("#" + context + "-" + name + "-loading-gif").removeClass('hidden');
    },

    hideLoadingGif = function (context, name) {
        $("#" + context + "-" + name + "-loading-gif").addClass('hidden');
    },

    cleanAlerts = function (context, name) {
        $("#" + context + "-" + name + "-alerts-wrapper").empty();
    },

    showAlert =  function (context, name, type, message) {
        dust.render('alerts/default.dust', {alert: {type: type, message: message}}, function (err, out) {
            $("#" + context + "-" + name + "-alerts-wrapper").append(out);
        });
    },

    resetAlerts = function (context, name) {
        var alertMessage = "Tip: If is taking too much time to load this file go make some stuff, then come back here, just dont close this page or the browser.";
        cleanAlerts(context, name);
        showAlert(context, name, "warning", alertMessage);
    },

    showInput = function (context) {
        $("#" + context + "-file-chooser-wrapper").removeClass("hidden");
    },

    hideInput = function (context, name) {
        $("#" + context + "-file-chooser-wrapper").addClass("hidden");
    },

    resetInput = function (context, name) {
        hideLoadingGif(context, name);
        resetAlerts(context, name);
    };
