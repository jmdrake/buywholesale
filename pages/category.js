$(document).ready(function () {
    var match;
    if ((match = location.href.match(/\?category=(\w*)/)) != null) {
        var category = decodeURI(location.href.split("=")[1]);
        console.log(category);
        $("#category").html(category);
        getItems(category, function(items){
            populateDivList($("#items"), items, $("#tmplItem"), {"imagepath" : "https:"})
        });
    } 
});
