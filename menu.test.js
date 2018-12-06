var PouchDB = require("pouchdb");
var db = new PouchDB("https://ttlyhatenewormonewistare:b714d61254fb4782ab1994111c49e44b86f94996@55644244-4beb-4ca8-b177-8ff6d5c3cc0b-bluemix.cloudant.com/buywholesalemenus"); 


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

getCategories(function(docs){console.log(docs)});