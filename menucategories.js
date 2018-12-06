var PouchDB = require("pouchdb");
var dbmenu = new PouchDB("https://ttlyhatenewormonewistare:b714d61254fb4782ab1994111c49e44b86f94996@55644244-4beb-4ca8-b177-8ff6d5c3cc0b-bluemix.cloudant.com/buywholesalemenus"); 
var dbcat = new PouchDB("https://ttlyhatenewormonewistare:b714d61254fb4782ab1994111c49e44b86f94996@55644244-4beb-4ca8-b177-8ff6d5c3cc0b-bluemix.cloudant.com/buywholesalecategories"); 

dbmenu.allDocs({include_docs : true}).then(function(results){
    for(var i=0; i < results.rows.length; i++){
        var doc = results.rows[i].doc;
        var newdoc = {};
        newdoc["_id"] = doc["_id"];
        newdoc["label"] = doc["name"];
        newdoc["parent"] = "";
        dbcat.put(newdoc).catch(function(err){console.log(err)});
        for(var j = 0; j < doc.categories.length; j++) {
            var newdoc2 = {};
            newdoc2["_id"] = doc.categories[j];
            newdoc2["label"] = doc.categories[j];
            newdoc2["parent"] = newdoc["_id"];
            dbcat.put(newdoc2).catch(function(err){console.log(err)});
            var stop = new Date().getTime();
            var time = 100;
            while(new Date().getTime() < stop + time) {
                ;
            }            
        }
        // console.log(doc);
        // console.log(newdoc);
    }
});