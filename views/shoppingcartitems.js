$(document).ready(function(){
    var match;
    $("#shoppingcart").load("../views/shoppingcartitems.html", function(){
        populateCartList();

        $(".quantity").on("change", function(event){
            var div = $(this).parent().parent();
            var id = div.find("#_id").val();
            var qty = div.find(".quantity").val();
        });        
    });
});


function updateCart(e)
{
    var qty = $(e).val();
    var id = $(e).parent().parent().find("#_id").val();
    console.log("New qty : " + qty);
    addToCart(id, qty, function(res){
        var tmplDiv = $("#shoppinglist").find("#tmplCartItem").clone();
        // $("#shoppingcart").html("<tr><th>Item</th><th>Price</th><th>Quantity</th><th>Total</th></tr>");
        // $("#shoppingcart").append(tmplDiv);
        while($("#shoppinglist").find("tr").get(2) != undefined){
            $("#shoppinglist").find("tr").get(2).remove()
        }
        populateCartList();
        updateCartIcon();
    })
}

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