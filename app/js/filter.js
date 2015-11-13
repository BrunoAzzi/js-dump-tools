function filterByDateInterval(data, beginDate, endDate) {
        return data.filter(function(row) {
            return row.timestamp.isBetween(beginDate, endDate);
        });
    }
