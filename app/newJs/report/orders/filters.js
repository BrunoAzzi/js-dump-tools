var toggleErrors = function() {
        var self = $("#error-filter");
        if (self.hasClass("label-danger")){
            self.removeClass("label-danger");
            self.addClass("label-default");
        } else {
            self.removeClass("label-default");
            self.addClass("label-danger");
        }
        if (teste) if (dumpTools.tests.summary.errors === 0) return false;
        $("#tested-orders-result > div").each(function() {
            var self = $(this);
            if(self.hasClass("panel-danger")){
                if(self.hasClass("hidden")){
                    self.removeClass("hidden");
                } else {
                    self.addClass("hidden");
                }
            }
        });
    },

    toggleWarnings = function() {
        var self = $("#warning-filter");
        if (self.hasClass("label-warning")){
            self.removeClass("label-warning");
            self.addClass("label-default");
        } else {
            self.removeClass("label-default");
            self.addClass("label-warning");
        }
        if (teste) if (dumpTools.tests.summary.warnings === 0) return false;
        $("#tested-orders-result > div").each(function() {
            var self = $(this);
            if(self.hasClass("panel-warning")){
                if(self.hasClass("hidden")){
                    self.removeClass("hidden");
                } else {
                    self.addClass("hidden");
                }
            }
        });
    },

    toggleSuccess = function() {
        var self = $("#success-filter");
        if (self.hasClass("label-success")){
            self.removeClass("label-success");
            self.addClass("label-default");
        } else {
            self.removeClass("label-default");
            self.addClass("label-success");
        }
        if (teste) if (dumpTools.tests.summary.successes === 0) return false;
        $("#tested-orders-result > div").each(function() {
            var self = $(this);
            if(self.hasClass("panel-success")){
                if(self.hasClass("hidden")){
                    self.removeClass("hidden");
                } else {
                    self.addClass("hidden");
                }
            }
        });
    },

    resetFilters = function() {
        var successFilter = $("#success-filter"),
            warningFilter = $("#warning-filter"),
            errorFilter = $("#error-filter");
        successFilter.attr("class","label label-success");
        warningFilter.attr("class","label label-warning");
        errorFilter.attr("class","label label-danger");
    };
