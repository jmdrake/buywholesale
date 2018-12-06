$(document).ready(function(){
    var match;
    $("#localitems").load("../views/localitems.html", function(){
        getLocalItems(function(items){
            populateDivList($("#localitems"), items, $("#tmplLocalItem"), {imagepath : "https:", rowset : {size : 4, row : $("#item-row")}});
            console.log(items);
        })            
    });
});
