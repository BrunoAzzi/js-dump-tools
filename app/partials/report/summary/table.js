(function(dust){dust.register("partials\/report\/summary\/table",body_0);function body_0(chk,ctx){return chk.w("<table class='table table-bordered'><thead><tr><th>#</th><th>").f(ctx.get(["clientName"], false),ctx,"h").w("</th><th>").f(ctx.get(["platformName"], false),ctx,"h").w("</th><th>").f(ctx.getPath(false, ["lang","difference","title"]),ctx,"h").w("</th></tr></thead><tbody><tr><th scope='row'>").f(ctx.getPath(false, ["lang","orders","numberOfOrders"]),ctx,"h").w("</th><td>").f(ctx.getPath(false, ["numberOfOrders","client"]),ctx,"h").w("</td><td>").f(ctx.getPath(false, ["numberOfOrders","platform"]),ctx,"h").w("</td><td>").f(ctx.getPath(false, ["numberOfOrders","difference"]),ctx,"h").w("</td></tr><tr><th scope='row'>").f(ctx.getPath(false, ["lang","orders","aloneOrders"]),ctx,"h").w("</th><td>").f(ctx.getPath(false, ["aloneOrders","client"]),ctx,"h").w("</td><td>").f(ctx.getPath(false, ["aloneOrders","platform"]),ctx,"h").w("</td><td>#</td></tr><tr><th scope='row'>").f(ctx.getPath(false, ["lang","difference","numberOfOrders"]),ctx,"h").w("</th><td>").f(ctx.getPath(false, ["differenceInNumberOfOrdersPercentage","client"]),ctx,"h").w("%</td><td>").f(ctx.getPath(false, ["differenceInNumberOfOrdersPercentage","platform"]),ctx,"h").w("%</td><td>#</td></tr><tr><th scope='row'>").f(ctx.getPath(false, ["lang","aloneOrdersRepresentation"]),ctx,"h").w("</th><td>").f(ctx.getPath(false, ["aloneOrdersRepresentationPercentage","client"]),ctx,"h").w("%</td><td>").f(ctx.getPath(false, ["aloneOrdersRepresentationPercentage","platform"]),ctx,"h").w("%</td><td>#</td></tr><tr><th scope='row'>").f(ctx.getPath(false, ["lang","orders","amountOfOrders"]),ctx,"h").w("</th><td>").f(ctx.getPath(false, ["amountOfOrders","client"]),ctx,"h").w("</td><td>").f(ctx.getPath(false, ["amountOfOrders","platform"]),ctx,"h").w("</td><td>").f(ctx.getPath(false, ["amountOfOrders","difference"]),ctx,"h").w("</td></tr><tr><th scope='row'>").f(ctx.getPath(false, ["lang","difference","amountOfOrders"]),ctx,"h").w("</th><td>").f(ctx.getPath(false, ["differenceInAmountOfOrdersRepresentationPercentage","client"]),ctx,"h").w("%</td><td>").f(ctx.getPath(false, ["differenceInAmountOfOrdersRepresentationPercentage","platform"]),ctx,"h").w("%</td><td>#</td></tr><tr><th scope='row'>").f(ctx.getPath(false, ["lang","averageTicket"]),ctx,"h").w("</th><td>").f(ctx.getPath(false, ["averageTicket","client"]),ctx,"h").w("</td><td>").f(ctx.getPath(false, ["averageTicket","platform"]),ctx,"h").w("</td><td>").f(ctx.getPath(false, ["averageTicket","difference"]),ctx,"h").w("</td></tr><tr><th scope='row'>").f(ctx.getPath(false, ["lang","inconsistentOrdersInCommomOrders"]),ctx,"h").w(": ").f(ctx.getPath(false, ["inconsistentOrdersRepresentationPercentage","total"]),ctx,"h").w("</th><td>").f(ctx.getPath(false, ["inconsistentOrdersRepresentationPercentage","client"]),ctx,"h").w("%</td><td>").f(ctx.getPath(false, ["inconsistentOrdersRepresentationPercentage","platform"]),ctx,"h").w("%</td><td>#</td></tr></tbody></table><div id='alerts' class='col-md-12'>").s(ctx.get(["alert"], false),ctx,{"block":body_1},{}).w("</div>");}body_0.__dustBody=!0;function body_1(chk,ctx){return chk.p("partials/report/summary/alert",ctx,ctx,{});}body_1.__dustBody=!0;return body_0}(dust));