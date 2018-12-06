$(document).ready(function(){
    var match;
    $("#checkoutcart").load("../views/checkoutcart.html", function(){
        populateCartList();

        $(".quantity").on("change", function(event){
            var div = $(this).parent().parent();
            var id = div.find("#_id").val();
            var qty = div.find(".quantity").val();
        });        
    });
});


function populateCartList()
{
    getCartItems(function(items){
        var grandtotal = 0;
        populateDivList($("#shoppinglist"), items, $("#tmplCartItem"), {
            callback : function(div, data){
                var total = parseFloat(data["price"]) * parseInt(data["qty"]);
                div.find("#total").html(Math.floor(total * 100)/100);
                div.find("#name").html(data["_id"]);
            }
        });
        for(var i = 0; i < items.length; i++){
            grandtotal += parseFloat(items[i]["price"]) * parseInt(items[i]["qty"]);
        }
        $("#shoppinglist").find("tbody").append("<tr><td></<td><td></td><th>Grand Total</th><td>$" + Math.floor(grandtotal * 100) / 100 + "</td></tr>");
    })    
}