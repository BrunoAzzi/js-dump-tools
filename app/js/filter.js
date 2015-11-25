var filterByDateInterval = function(data, beginDate, endDate) {
        return data.filter(function(row) {
            return row.timestamp.isBetween(beginDate, endDate, 'day');
            // || row.timestamp.isSame(beginDate, 'day') || row.timestamp.isSame(endDate, 'day');
        });
    },

    filterResultByActivationDate = function(data, activationDate) {
        return data.filter(function(row) {
            var date = row.timestamp.match("([0-9]{4}\-[0-9]{2}\-[0-9]{2})");
            // console.log(date);
            var values = date[0].split("-");
            var activationsValues = activationDate.split("-");

            if(values[0] >= activationsValues[0]){
                if(values[1] >= activationsValues[1]){
                    if(values[2] >= activationsValues[2]){
                        return true;
                    }
                }
            }

            return false;
        });
    };
