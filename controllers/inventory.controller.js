var dbRemote = new PouchDB("https://ttlyhatenewormonewistare:b714d61254fb4782ab1994111c49e44b86f94996@55644244-4beb-4ca8-b177-8ff6d5c3cc0b-bluemix.cloudant.com/buywholesaleinventory");

// var dbRemote = new PouchDB("https://ttlyhatenewormonewistare:b714d61254fb4782ab1994111c49e44b86f94996@55644244-4beb-4ca8-b177-8ff6d5c3cc0b-bluemix.cloudant.com/menardsinventory");


function getItems(category, callback)
{
    var docs = [];
    dbRemote.allDocs({include_docs : true}).then(function(results){
        for(var i=0; i < results.rows.length; i++){
            if(results.rows[i].doc.category==category)
                docs[docs.length] = results.rows[i].doc;
        }
        callback(docs)
    }).catch(function(err){callback(err)})
}

function getLocalItems(callback)
{
    var docs = [];
    dbRemote.allDocs({include_docs : true}).then(function(results){
        for(var i=0; i < results.rows.length; i++){
            if(results.rows[i].doc.localpickup)
                docs[docs.length] = results.rows[i].doc;
        }
        callback(docs)
    }).catch(function(err){callback(err)})
}

function getSampleItems(n, callback)
{
    var docs = [];
    dbRemote.allDocs({include_docs : true}).then(function(results){
        for(var i=0; i < n; i++){
            var index = Math.floor(Math.random() * results.rows.length);
            docs.push(results.rows[index].doc);
        }
        callback(docs)
    }).catch(function(err){callback(err)})
}

function getItem(item, callback)
{
    dbRemote.get(item).then(function(doc){
        callback(doc)
    }).catch(function(err){console.log(err)})
}

function saveItem(item)
{
    dbRemote.put(item).then(function(results){
        console.log(results)
    }).catch(function(err){
        console.log(err)
    })
}

function deleteItem(item)
{
    dbRemote.get(item).then(function (doc) {
       return dbRemote.remove(doc);
    });
}