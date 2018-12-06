var PouchDB = require("pouchdb");
var db = new PouchDB("https://ttlyhatenewormonewistare:b714d61254fb4782ab1994111c49e44b86f94996@55644244-4beb-4ca8-b177-8ff6d5c3cc0b-bluemix.cloudant.com/buywholesalemenusv"); 

const scrapeIt = require("scrape-it");

scrapeIt("https://preview.c9users.io/jmdrake/buywholesaleinc/newsite.html", {
    departments : {
        listItem: ".department",
        data: {
            name : ".name",
            categories : {
                listItem : ".sub_menu nav a"
            }
        }
    }
}).then(({data, response})=>{
    for(var i=0; i < data.departments.length; i++){
        var doc = data.departments[i];
        doc["_id"] = doc["name"];
        db.put(doc).then(function(res){console.log(res)}).catch(function(err){console.log(err)});
    }
});

