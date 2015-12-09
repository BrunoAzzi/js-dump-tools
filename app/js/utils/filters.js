var filterByDateInterval = function(data, beginDate, endDate) {
        return data.filter(function(row) {
            return row.timestamp.isBetween(beginDate, endDate, 'day');
            // || row.timestamp.isSame(beginDate, 'day') || row.timestamp.isSame(endDate, 'day');
        });
    },

    filterResultByActivationDate = function(data, activationDate) {
        if(!activationDate) return data;

        return data.filter( function(row) {
            var orderDate = row.timestamp.match("([0-9]{4}\-[0-9]{2}\-[0-9]{2})")[0],
                orderDateValues = orderDate.split("-"),
                orderYear = orderDateValues[0],
                orderMonth = orderDateValues[1],
                orderDay = orderDateValues[2];

            var activationDateValues = activationDate.split("-"),
                activationDateYear = activationDateValues[0],
                activationDateMonth = activationDateValues[1],
                activationDateDay = activationDateValues[2];

            if(orderYear >= activationDateYear){
                if(orderMonth >= activationDateMonth){
                    if(orderDay >= activationDateDay){
                        return true;
                    }
                }
            }

            return false;
        });
    };
