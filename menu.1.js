var db = new PouchDB("https://ttlyhatenewormonewistare:b714d61254fb4782ab1994111c49e44b86f94996@55644244-4beb-4ca8-b177-8ff6d5c3cc0b-bluemix.cloudant.com/buywholesalemenus"); 

$(document).ready(function(){
    $("#departmentmenu").load("menu.html", function(){
        getCategories(function(categories){
            populateDivList($("#departments"), categories, $("#department"), {
                callback : function(div, data){
                    var newlink;
                    var categorylist = div.find("#categorylist");
                    for(var i=0; i < data.categories.length; i++){
                        var category = data.categories[i];
                        categorylist.append('<a href="' + category + '">' + category + '</a>');
                    }
                    div.mouseout(function(){$(this).find(".sub_menu").hide()});
                    div.mouseover(function(){$(this).find(".sub_menu").show()});
               }
           })
       })
   }); 
});


function getCategories(callback)
{
    var docs = [];
    db.allDocs({include_docs : true}).then(function(results){
        for(var i=0; i < results.rows.length; i++){
            docs[i] = results.rows[i].doc;
        }
        callback(docs)
    });    
}