var PouchDB = require("pouchdb");
// var db = new PouchDB("https://ttlyhatenewormonewistare:b714d61254fb4782ab1994111c49e44b86f94996@55644244-4beb-4ca8-b177-8ff6d5c3cc0b-bluemix.cloudant.com/buywholesalemenus"); 
var dbRemote = new PouchDB("https://ttlyhatenewormonewistare:b714d61254fb4782ab1994111c49e44b86f94996@55644244-4beb-4ca8-b177-8ff6d5c3cc0b-bluemix.cloudant.com/buywholesaleinventory");
var dbLocal = new PouchDB("inventory");

dbLocal.sync(dbRemote, {batch_size : 10});
// dbInventory.destroy();
// var dbInventory = new PouchDB("inventory");

const scrapeIt = require("scrape-it");

// scrapeCategory("https://www.menards.com/main/bath/bathroom-fan-accessories/c-1453749026746.htm");

scrapeAll();

function scrapeAll()
{
    scrapeIt("https://www.menards.com/main/home.html",  {
        links : {
            listItem : ".flyoutChildDiv .column div", 
            data: {
                title: "a", 
                url: {
                    selector: "a", 
                    attr: "href"
                }
            }
        }
    }).then(({data, response})=>{
        //console.log(data.links.length);
        //console.log(data.links[0]["url"]);
        /* for(var i=0; i < data.links.length; i++){
            scrapeCategory("https:" + data.links[i].url);
        }*/
        console.log(data.links);
    })
}

function strBetween(string, strStart, strEnd)
{
    var posStart = string.indexOf(strStart) + strStart.length;
    var posEnd = string.indexOf(strEnd) + strEnd.length;
    return string.slice(posStart, posEnd);
}

function scrapeCategory(url)
{
    scrapeIt(url, {scripts : {listItem : "script"}}).then(({data, response})=>{
        for(var i = 0; i < data.scripts.length; i++)
        {
            var match;
            var start;
            var script = data.scripts[i];
            var doc;
            
            if(typeof script == 'string' && (start = script.indexOf("var qubitEcProduct")) > 0)
            {
                var end = script.indexOf("}];", start);
                console.log(end);
                var inventory = JSON.parse(script.slice(start + 20, end+2));
                
                var meta = strBetween(script, "var qubitEcView =", "};");
                // console.log(JSON.parse(meta.slice(0, meta.length-1)));
                console.log("Inventory : " + inventory.length);
                for(var j=0; j < inventory.length; j++){
                    // console.log(inventory[j]);
                    doc = inventory[j].product;
                    // console.log(doc);
                    // console.log(inventory[0].product.images);
                    doc._id = doc.name;
                    // doc.category = meta.subtypes[0];
                    doc.image = doc.images[0];
                    doc.price = doc.price.value;
                    doc.suppliersku = doc.sku;
                    doc.category = doc.category[0].split(">")[1].trim();
                    delete(doc.clearance);
                    delete(doc.onsale);
                    delete(doc.images);
                    delete(doc.originalPrice);
                    delete(doc.mailInPrice);
                    delete(doc.sku);
                    // console.log(doc);
                    dbLocal.put(doc).then(function(res){
                        scrapeItem(res.id)
                    }).catch(function(err){console.log("Error 1"); console.log(err)})
                }                
                
            } else {
                // console.log(data.scripts[i]);
            }
        }
    });
}

var itempagescrape = {
    modelnumber : {
        selector : ".itemBasicInfoPadding",
        convert : x => x == '' ? x : x.split(/:/)[1].split(/\n/)[0].trim()
    },
    suppliersku : {
        selector : ".itemBasicInfoDivider",
        convert : x => x == '' ? x : x.split(/:/)[1].split(/\n/)[0].trim()        
    },
    pricedollars : ".priceBigVal",
    pricecents : ".centsVal",
    description : {
        selector : "#itemDetailPageDetails .expandThisSection",
        convert : x => x == '' ? x : removeblanks(x.split(/\n\t*/)),
        eq : 2
    }, 
    specifications : {
        selector : "table",
        eq : 0,
        convert : x => x == '' ? x :  removeblanks(x.split(/\n\t*/)),
    }
}

/*
scrapeIt("https://www.menards.com/main/bath/bathroom-fan-accessories/broan-reg-grille-with-light-lens/s97013662/p-1444425984087-c-1453749026746.htm?tid=250626648347621755&ipos=21", 
    itempagescrape).then(({data, response})=>{
        console.log(data);
});*/

function scrapeItem(item)
{
    dbLocal.get(item).then(function(doc){
        scrapeIt("http:" + doc.url, itempagescrape).then(({data, response})=>{
            doc.modelnumber = data.modelnumber;
            doc.suppliersku = data.suppliersku;
            doc.price = data.pricedollars + "." + data.pricecents;
            doc.description = data.description;
            doc.specifications = data.specifications;
            // console.log(data);
            dbLocal.put(doc).then(function(res){console.log(res)}).catch(function(err){console.log("Error 2"); console.log(err)})
        })
    }).catch(function(err){console.log("Error 3"); console.log(err)});
}


function removeblanks(a)
{
    var newa = [];
    for(var i = 0; i < a.length; i++){
        if(a[i]!='')
            newa[newa.length] = a[i]
    }
    return newa;
}

