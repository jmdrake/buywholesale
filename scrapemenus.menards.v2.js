var PouchDB = require("pouchdb");
// var dbRemote = new PouchDB("https://ttlyhatenewormonewistare:b714d61254fb4782ab1994111c49e44b86f94996@55644244-4beb-4ca8-b177-8ff6d5c3cc0b-bluemix.cloudant.com/menardsmenusv2"); 
var dbRemote = new PouchDB("https://forkshgressithervionally:fbe37c1a9cc85dc7f6eb7bcb9bd29aae4870beed@55644244-4beb-4ca8-b177-8ff6d5c3cc0b-bluemix.cloudant.com/menardsmenusv2"); 
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
    console.log(data);
    console.log(data.departments[0].categories);
    
    for(var i=0; i < data.departments.length; i++){
        var doc = {};
        if(data.departments[i].name != ""){
            doc["_id"] = data.departments[i]["name"];
            doc["parent"] = null;
            dbLocal.put(doc).then(res => {
                // console.log(res);
            }).catch(function(err){console.log(err)});
            for(var j=0; j < data.departments[i].categories.length; j++){
                var childdoc = {};
                childdoc["_id"] = data.departments[i].categories[j].label;
                childdoc["category"] = doc["_id"] + "|" + data.departments[i].categories[j].label;
                childdoc["parent"] = doc["_id"];
                // console.log(doc["_id"] + "." + data.departments[i].categories[j].label)
                dbLocal.put(childdoc)
            }
        }
    }    
});

dbLocal.sync(dbRemote, {batch_size : 10});