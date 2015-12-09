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
    };
