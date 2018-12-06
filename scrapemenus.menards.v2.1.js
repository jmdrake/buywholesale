var PouchDB = require("pouchdb");
var dbRemote = new PouchDB("https://ttlyhatenewormonewistare:b714d61254fb4782ab1994111c49e44b86f94996@55644244-4beb-4ca8-b177-8ff6d5c3cc0b-bluemix.cloudant.com/menardsmenusv2"); 
var dbLocal = new PouchDB("menus");

const scrapeIt = require("scrape-it");

scrapeIt("https://www.menards.com/main/home.html", {
    departments : {
        listItem: "#departments-button > li > ul > li",
        data : {
            name : "a.deptNavMainDropMenu",
            categories : {
                listItem : ".column > div",
                data : {
                    label : "div > a"
                }
            }
        }
    }
}).then(({data, response})=>{
    // console.log(data);
    // console.log(data.departments[0].categories);
    
    for(var i=0; i < data.departments.length; i++){
        var scrapeDoc = data.departments[i];
        // console.log(scrapeDoc);
        var newCat = {
            "_id" : Date.now().toString(),
            "category" : scrapeDoc["name"],
            "parent" : null
        };
        
        if(newCat.category != "") {
            // console.log(newCat);
            // console.log(scrapeDoc.categories);
        
            dbLocal.put(newCat).then(function(result){
                console.log(result)
            }).catch(function(err){"Error is : " + err});
        }
        
    }    
}).catch(function(err){"Error code : " + err});

// dbLocal.sync(dbRemote, {batch_size : 10});