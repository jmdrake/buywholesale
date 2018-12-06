$(document).ready(function(){
    var match;
    $("#categorymenu").load("../views/categories.html", function(){
        if ((match = location.href.match(/\?category=(\w*)/)) != null) {   
            var category = decodeURIComponent(location.href.split("?")[1].split("&")[0].split("=")[1]);
            getCategories(category, function(categories){
                if(categories.length > 0) {
                    populateDivList($("#categories"), categories, $("#listcategory"), {"callback" : 
                        function(newDiv, data){
                            newDiv.find("a").attr("href", "category.html?category=" + data["_id"]);
                        }
                    });
                    console.log(categories);
                    $("#departmentmenu").hide();
                    $("#categorymenu").show();
                }
            });
        }        
    });
});