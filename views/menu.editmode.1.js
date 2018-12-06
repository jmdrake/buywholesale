$(document).ready(function(){
    $("#departmentmenu").load("../views/menu.editmode.html", function(){
        getDepartments(function(departments){
            populateDivList($("#departments"), departments, $("#department"), {
                callback : function(div, data){
                    var newlink;
                    var categorylist = div.find("#categorylist");
                    if(data.disabled) {
                        div.find("#name").addClass("disabled");
                    }
                    
                    for(var i = 0; i < data.categories.length; i++) {
                        // console.log(data.categories[i]);
                        // var newdiv = cloneDiv($(".categorySpan"), data.categories[i]);
                        // newdiv.find("a").html(data.categories[i].label);
                        var category = decodeHTMLEntity(data.categories[i].label);
                        if(data.categories[i].disabled) {
                            categorylist.append('<div class="categorySpan"><a href="category.editmode.html?category=' + encodeURIComponent(category) + 
                            '" class="category disabled" id="category" class="w3-button">' + category + 
                            '</a><i class="fa fa-trash cat-delete"></i>&nbsp;&nbsp;<i class="fa fa-ban cat-disable"></i></div>');
                        } else {
                            categorylist.append('<div class="categorySpan"><a href="category.editmode.html?category=' + encodeURIComponent(category) + 
                            '" class="category" id="category" class="w3-button">' + category + 
                            '</a><i class="fa fa-trash cat-delete"></i>&nbsp;&nbsp;<i class="fa fa-ban cat-disable"></i></div>');
                        }
                        
                        // newdiv.show();
                    }
                    /*
                    populateDivList(categorylist, data.categories, $(".categorySpan"), {
                       callback : function(div, data){
                           $(this).find("a").html(data.label);
                       } 
                    });
                    */
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