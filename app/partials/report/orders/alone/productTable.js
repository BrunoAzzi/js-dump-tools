(function(dust){dust.register("partials\/report\/orders\/alone\/productTable",body_0);function body_0(chk,ctx){return chk.w("<table class='table table-bordered'><thead><tr><th>#</th><th>Product Id</th><th>SKU</th><th>Price</th><th>Quantity</th></tr></thead><tbody>").s(ctx.get(["values"], false),ctx,{"block":body_1},{}).w("</tbody></table>");}body_0.__dustBody=!0;function body_1(chk,ctx){return chk.w("<tr><th scope='row'>#</th><td>").f(ctx.get(["pid"], false),ctx,"h").w("</td><td>").f(ctx.get(["sku"], false),ctx,"h").w("</td><td>").f(ctx.get(["price"], false),ctx,"h").w("</td><td>").f(ctx.get(["quantity"], false),ctx,"h").w("</td></tr>");}body_1.__dustBody=!0;return body_0}(dust));
