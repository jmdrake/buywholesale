$(document).ready(function(){
    var match;
    $("#sampleitems").load("../views/items.html", function(){
        getSampleItems(8, function(items){
            populateDivList($("#sampleitems"), items, $("#tmplItem"), {imagepath : "https:", rowset : {size : 4, row : $("#item-row")}});
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
    });
});
