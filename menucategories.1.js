var PouchDB = require("pouchdb");
var dbmenu = new PouchDB("https://ttlyhatenewormonewistare:b714d61254fb4782ab1994111c49e44b86f94996@55644244-4beb-4ca8-b177-8ff6d5c3cc0b-bluemix.cloudant.com/buywholesalemenus"); 
var dbcat = new PouchDB("https://ttlyhatenewormonewistare:b714d61254fb4782ab1994111c49e44b86f94996@55644244-4beb-4ca8-b177-8ff6d5c3cc0b-bluemix.cloudant.com/buywholesalecategories"); 

var department = parseInt(process.argv[2]);
var category = parseInt(process.argv[3]);

dbmenu.allDocs({include_docs : true}).then(function(results){
    var doc = results.rows[department].doc;
    console.log("Categories : " + doc.categories.length + doc.categories);
    var newdoc = {};
    newdoc["_id"] = doc["_id"];
    newdoc["label"] = doc["name"];
    newdoc["parent"] = "";
    if(category==0){dbcat.put(newdoc).catch(function(err){console.log(err)})};
    var limit = min(category + 9, doc.categories.length);
    console.log("Limit" + limit);
    console.log("Categories" + doc.categories.length);
    for(var j = category; j < limit; j++) {
        var newdoc2 = {};
        newdoc2["_id"] = doc.categories[j];
        newdoc2["label"] = doc.categories[j];
        newdoc2["parent"] = newdoc["_id"];
        dbcat.put(newdoc2).catch(function(err){console.log(err)});
    }
    // console.log(doc);
    // console.log(newdoc);
});

function min(a,b){
    return a < b ? a : b;
}