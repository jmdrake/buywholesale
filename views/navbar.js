$(document).ready(function(){
    $("#navbar").load("../views/navbar.html", function(){
        updateCartIcon();
   }); 
});

function updateCartIcon()
{
    getCartItems(function(items){
        var numitems = 0;
        for(var i = 0; i < items.length; i++) {
            numitems += parseInt(items[i].qty)
        }
        if(numitems > 0) {
            $("#cartcounter").html(numitems)
        }
    })
}