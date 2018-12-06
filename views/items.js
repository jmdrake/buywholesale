$(document).ready(function(){
    var match;
    $("#items").load("../views/items.html", function(){
        if ((match = location.href.match(/\?category=(\w*)/)) != null) {   
            var category = decodeURIComponent(location.href.split("?")[1].split("=")[1]);
            getItems(category, function(items){
                populateDivList($("#items"), items, $("#tmplItem"), {imagepath : "https:", rowset : {size : 4, row : $("#item-row")}});
                // console.log(items);
                $(".addtocart").on("click", function(e){
                    var item = $(this).parent().parent().find("#_id").val();
                    // getItem(item, function(doc){console.log(doc)})
                    addToCart(item, 1, function(res){
                        console.log(res);
                        updateCartIcon();
                    });
                })
            })            
        }        
    });
});
