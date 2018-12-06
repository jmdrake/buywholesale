$(document).ready(function(){
    $("#departmentmenu").load("../views/menu.editmode.html", function(){
        getDepartments(function(departments){
            populateDivList($("#departments"), departments, $("#department"), {
                callback : function(div, data){
                    if(!data.disabled){
                        getCategories(data["_id"], function(categories){
                            var categorylist = div.find("#categorylist");
                            for(var i=0; i < categories.length; i++){
                                var category = categories[i]["_id"];
                                if(!categories[i].disabled){
                                    categorylist.append('<div class="categorySpan"><a href="category.editmode.html?category=' + encodeURIComponent(category) + 
                                        '" class="category" id="category" class="w3-button">' + category + '</div>');                                    
                                }
                            }
                        });
                        div.mouseout(function(){$(this).find(".sub_menu").hide()});
                        div.mouseover(function(){$(this).find(".sub_menu").show()});
                    } else {
                        div.hide();
                    }
                    div.mouseout(function(){$(this).find(".sub_menu").hide()});
                    div.mouseover(function(){$(this).find(".sub_menu").show()});                    
               },
                final : function(){
                    $(".cat-disable").on("click", function(event){
                        var catdiv = $(this).parentsUntil("#categorylist").find("a");
                        // var department = $(this).parentsUntil(".department").find("#name").html();
                        var deptdiv = $(this).parent().parent().parent().parent().parent().find("#name");
                        var department = decodeHTMLEntity(deptdiv.html());
                        var category = decodeHTMLEntity(catdiv.html());
                        if(catdiv.hasClass("disabled")){
                            enableCategory(department, category, function(res){
                                console.log(res);
                            });
                            catdiv.removeClass("disabled");                            
                        } else {
                            disableCategory(department, category, function(res){
                                console.log(res);
                            });
                            catdiv.addClass("disabled");
                        }
                    });
                    $(".cat-delete").on("click", function(event){
                        var catdiv = $(this).parentsUntil("#categorylist").find("a");
                        // var department = $(this).parentsUntil(".department").find("#name").html();
                        var deptdiv = $(this).parent().parent().parent().parent().parent().find("#name");
                        var department = decodeHTMLEntity(deptdiv.html());
                        var category = decodeHTMLEntity(catdiv.html());
                        deleteCategory(department, category, function(res){
                            console.log(res)
                        });
                        catdiv.hide();
                    });
                    $(".dept-disable").on("click", function(event){
                        var deptdiv = $(this).parent().find("#name");
                        var department = decodeHTMLEntity(deptdiv.html());
                        if(deptdiv.hasClass("disabled")){
                            enableDepartment(department, function(res){
                                console.log(res);
                            });
                            deptdiv.removeClass("disabled");                            
                        } else {
                            disableDepartment(department, function(res){
                                console.log(res);
                            });
                            deptdiv.addClass("disabled");
                        }
                    });
                    $(".dept-delete").on("click", function(event){
                        var deptdiv = $(this).parent().find("#name");
                        var department = decodeHTMLEntity(deptdiv.html());
                        deleteDepartment(department, function(res){
                            console.log(res)
                        });
                        depdiv.hide();
                    });                    
                }
            })
        });
    }); 
});


function decodeHTMLEntity(str)
{
    str = str.replace("&amp;", "&");
    return str;
}