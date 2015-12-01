var platformLogin = function() {
        diff.mode = "signed";
        $.ajax({
            url: 'https://platform.chaordicsystems.com/raas/v1/clients',
            statusCode : {
                200: function(xhr, status, error) {
                    console.log(xhr);
                    var err = eval("(" + xhr.responseText + ")");
                    console.log(xhr.responseText);
                    $("#platform-access-input-wrapper").addClass("hidden");
                    $("#api-key-input-wrapper").removeClass("hidden");
                    $("#api-key-select-group").removeClass("hidden");
                }
            }
        });
    },

    publicMode = function() {
        diff.mode = "public";
        $("#platform-access-input-wrapper").addClass("hidden");
        $("#api-key-input-wrapper").removeClass("hidden");
        $("#api-key-input-group").removeClass("hidden");
    }
