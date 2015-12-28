dust.filters.formatCurrencyValue = function(value) {
    return numeral(value).format('$0,0.00');
},

dust.filters.formatIntegerValue = function(value) {
    return numeral(value).format('0,0');
},

dust.filters.formatDate = function(value) {
    return moment(value).format('YYYY-MM-DD HH:mm:SS');
},

dust.filters.sortProductArray = function(value) {
    return value.sort(compareProductArray);
};
