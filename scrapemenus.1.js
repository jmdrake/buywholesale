var PouchDB = require("pouchdb");
var db = new PouchDB("https://ttlyhatenewormonewistare:b714d61254fb4782ab1994111c49e44b86f94996@55644244-4beb-4ca8-b177-8ff6d5c3cc0b-bluemix.cloudant.com/buywholesalemenusv2"); 

const scrapeIt = require("scrape-it");

var department = parseInt(process.argv[2]);

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
    for(var i=department; i < min(i + 9, data.departments.length); i++){
        var doc = data.departments[i];
        doc["_id"] = doc["name"];
        doc["disabled"] = false;
        for(var j=0; j < doc.categories.length; j++) {
            var newcat = {};
            newcat.label = doc.categories[j];
            newcat.disabled = false;
            doc.categories[j] = newcat;
        }
        db.put(doc).then(function(res){console.log(res)}).catch(function(err){console.log(err)});
    }
});

function min(a,b){
    return a < b ? a : b;
}