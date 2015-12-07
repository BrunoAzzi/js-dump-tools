importScripts('../../components/oboe/dist/oboe-browser.js');
importScripts('../../js/utf8.js');

var whatever = {};

onmessage = function(event) {
    var size = 0;

    oboe(event.data.fileUrl).done(function(things){
        //todo este calculo é desnecessário caso tenha uma forma melhor de saber quando o stream termina.
        var str = JSON.stringify(things)+"\n";

        //uso da biblioteca para calcular os bytes.
        size += utf8.encode(str).length;

        if(event.data.context == "platform"){
            size += things.items.length * 2;
            if(str.match(/\//g)) size += str.match(/\//g).length;
        }

        if(size >= this.header('Content-Length') | size >= this.header('Content-Length')-1){
            postMessage({
                things: things,
                end: true
            });
            close();
        } else {
            postMessage(things);
        }

    })
    .fail(function() {
        console.log("FAIL");
    });
}
