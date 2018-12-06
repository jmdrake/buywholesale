var PouchDB = require("pouchdb");

var inventory = require("./inventory.js");
var dbMenus = new PouchDB("menardsmenus"); 
var dbMenusRemote = new PouchDB("https://ttlyhatenewormonewistare:b714d61254fb4782ab1994111c49e44b86f94996@55644244-4beb-4ca8-b177-8ff6d5c3cc0b-bluemix.cloudant.com/menardsmenus"); 


var menus = require("./menus.js");

var dbInventory = new PouchDB("menardinventory");
var dbInventoryRemote = new PouchDB("https://ttlyhatenewormonewistare:b714d61254fb4782ab1994111c49e44b86f94996@55644244-4beb-4ca8-b177-8ff6d5c3cc0b-bluemix.cloudant.com/menardsinventory");
var dictCats = {};

function wait(ms)
{
    var stop = Date.now() + ms;
    while(Date.now() < stop);
}

// dbInventory.sync(dbInventoryRemote, {batch_size : 10});
dbMenus.sync(dbMenusRemote, {batch_size : 10});

dbInventoryRemote.allDocs({include_docs:true}).then(function(res){
    for(var i = 0; i < res.rows.length; i++)
    {
        dictCats[res.rows[i].doc.category] = true;
    }
    dbMenus.allDocs({include_docs:true}).then(function(res){
        for(var i=0; i < res.rows.length; i++){
            var doc = res.rows[i].doc;
            for(var j=0; j < doc.categories.length; j++)
            {
                if(dictCats[doc.categories[j].label]) {
                    doc.categories[j].disabled = false;
                }
            }
            dbMenus.put(doc).then(function(res){
                // console.log(res)
            }).catch(function(err){
                console.log(err)
            })
            // console.log(doc)
        }
    })
})

