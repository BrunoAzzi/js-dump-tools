var dumpTools = {
        platform: {
            data: [],
            name: "Chaordic",
            amountOfOrders: 0,
            numberOfOrders: 0,
            numberOfProducts: 0,
            aloneOrders: []
        },
        client: {
            data: [],
            name: "Cliente",
            amountOfOrders: 0,
            numberOfOrders: 0,
            numberOfProducts: 0,
            aloneOrders: [],
            extentDays: []
        },
        tests: {
            results: [],
            summary: {
                errors: 0,
                warnings: 0,
                successes: 0
            }
        }
    },
    en = {
        "in": " in ",
        "difference": {
            "title": "Difference",
            "orders": "Difference of orders",
            "amount": "Difference of amount",
            "numberOfOrders": "Difference in number of orders",
            "amountOfOrders": "Difference in amount of Orders"
        },
        "orders": {
            "numberOfOrders": "Number of orders",
            "aloneOrders": "Alone orders",
            "amountOfOrders": "Amount of orders"
        },
        "aloneOrdersRepresentation": "Alone orders representation",
        "averageTicket": "Average ticket",
        "inconsistentOrdersInCommomOrders": "Inconsistent orders in commom orders",
        "alert": {
            "warning": " is close to the max percentage (Between 5% and 10%) - We need to take make some tests!",
            "error": " is above of the max percentage - The percentage is below of 10%!",
            "success": " is less than a half of the max percentage - We are Ok"
        }
    },
    ptBr = {
        "in": " em ",
        "difference": {
          "title": "Diferença",
          "orders": "Diferença de transações",
          "amount": "Diferença de valor",
          "numberOfOrders": "Diferença na quantidade das transações",
          "amountOfOrders": "Diferença no valor das transações"
        },
        "orders": {
          "numberOfOrders": "Número de transações",
          "aloneOrders": "Transações sozinhas",
          "amountOfOrders": "Valor das transações"
        },
        "aloneOrdersRepresentation": "Representação das transações sozinhas",
        "averageTicket": "Ticket médio",
        "inconsistentOrdersInCommomOrders": "Transações inconsistentes",
        "alert": {
          "warning": " está perto da porcentagem máxima (entre 5% e 10%) - Precisamos fazer mais testes!",
          "error": " está acima da porcentagem máxima - A porcentagem está acima de 10%!",
          "success": " é menos que a metade da porcentagem máxima - Estamos bem"
        }
    },
    lang = ptBr;

$(document).on('change', '.btn-file :file', function() {
  var input = $(this),
      numFiles = input.get(0).files ? input.get(0).files.length : 1,
      label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
  input.trigger('fileselect', [numFiles, label]);
});

$(document).ready( function() {
    $('.btn-file :file').on('fileselect', function(event, numFiles, label) {
        var input = $(this).parents('.input-group').find(':text'),
            log = label;

        if (input.length) {
            input.val(log);
        } else {
            if (log) alert(log);
        }
    });
});

$('#activation-date-input').datetimepicker({
    format: 'YYYY-MM-DD',
    extraFormats: [ 'YYYY-MM-DD HH:mm:SS', moment.ISO_8601 ]
});
