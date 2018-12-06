var PouchDB = require("pouchdb");
var menus = require("./menus.js");
var dbRemote = new PouchDB("https://ttlyhatenewormonewistare:b714d61254fb4782ab1994111c49e44b86f94996@55644244-4beb-4ca8-b177-8ff6d5c3cc0b-bluemix.cloudant.com/menardsinventory");
var dbLocal = new PouchDB("menardinventory");

dbLocal.sync(dbRemote, {batch_size : 10});

exports.getItems = function(category, callback)
{
    var docs = [];
    dbLocal.allDocs({include_docs : true}).then(function(results){
        for(var i=0; i < results.rows.length; i++){
            if(results.rows[i].doc.category==category)
                docs[docs.length] = results.rows[i].doc;
        }
        callback(docs)
    }).catch(function(err){console.log(err)})
}

exports.getItemsv2 = function(category, callback)
{
    var docs = [];
    dbLocal.allDocs({include_docs : true}).then(function(results){
        for(var i=0; i < results.rows.length; i++){
            if(results.rows[i].doc.category==category)
                docs[docs.length] = results.rows[i].doc;
        }
        callback(category, docs)
    }).catch(function(err){console.log(err)})
}


exports.getItem = function(item, callback)
{
    dbLocal.get(item).then(function(doc){
        callback(doc)
    })
}

exports.setItem = function(item)
{
    dbLocal.put(item).then(function(results){
        console.log(results)
    }).catch(function(err){
        console.log(err)
    })
}

exports.deleteItem =  function(item)
{
    dbLocal.get(item).then(function (doc) {
       return dbLocal.remove(doc);
    });
}

exports.enableCategories = function()
{
    dbLocal.allDocs({include_docs : true}).then(function(results){
        for(var i=0; i<results.rows.length; i++){
            var doc = results.rows[i].doc;
            // menus.enableCategory(doc.department, doc.category, function(res){console.log(res)});
            console.log(doc._id + ":" + doc.department)
        }
    })
}