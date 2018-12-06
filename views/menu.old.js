$(document).ready(function(){
    $("#departmentmenu").load("../menu.html", function(){
        getDepartments(function(departments){
            populateDivList($("#departments"), departments, $("#department"), {
                callback : function(div, data){
                    if(!data.disabled){
                        var categorylist = div.find("#categorylist");
                        for(var i=0; i < data.categories.length; i++){
                            if(!data.categories[i].disabled){
                                var category = data.categories[i].label;
                                categorylist.append('<div class="categorySpan"><a href="category.html?category=' + encodeURIComponent(category) + 
                            '" class="category" id="category" class="w3-button">' + category + '</div>');
                            }
                        }
                        div.mouseout(function(){$(this).find(".sub_menu").hide()});
                        div.mouseover(function(){$(this).find(".sub_menu").show()});
                    } else {
                        div.hide();
                    }
               }
           })
       })
   }); 
});

