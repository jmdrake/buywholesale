var PouchDB = require("pouchdb");
// var db = new PouchDB("https://ttlyhatenewormonewistare:b714d61254fb4782ab1994111c49e44b86f94996@55644244-4beb-4ca8-b177-8ff6d5c3cc0b-bluemix.cloudant.com/buywholesalemenus"); 
var dbRemoteInventory = new PouchDB("https://ttlyhatenewormonewistare:b714d61254fb4782ab1994111c49e44b86f94996@55644244-4beb-4ca8-b177-8ff6d5c3cc0b-bluemix.cloudant.com/buywholesaleinventory");
var dbLocalInventory = new PouchDB("inventory");
var dbRemoteMenus = new PouchDB("https://forkshgressithervionally:fbe37c1a9cc85dc7f6eb7bcb9bd29aae4870beed@55644244-4beb-4ca8-b177-8ff6d5c3cc0b-bluemix.cloudant.com/menardsmenusv2"); 
var dbLocalMenus = new PouchDB("menus");

dbRemoteInventory.replicate.to(dbLocalInventory);
dbRemoteMenus.replicate.to(dbLocalMenus);

// dbLocal.sync(dbRemote, {batch_size : 5});
// dbInventory.destroy();
// var dbInventory = new PouchDB("inventory");

const scrapeIt = require("scrape-it");

// scrapeCategory("http:" + process.argv[2]);

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
        for(var i=0; i < data.links.length; i++){
            scrapeCategory("https:" + data.links[i].url);
        }
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
    console.log("Scraping : " + url);
    scrapeIt(url, {scripts : {listItem : "script"}}).then(({data, response})=>{
        for(var i = 0; i < data.scripts.length; i++)
        {
            var start;
            var script = data.scripts[i];
            var doc;
            
            if(typeof script == 'string' && (start = script.indexOf("var qubitEcProduct")) > 0)
            {
                var end = script.indexOf("}];", start);
                try{
                    var inventory = JSON.parse(script.slice(start + 20, end+2));
                    var meta = strBetween(script, "var qubitEcView =", "};");
                    console.log("Inventory : " + inventory.length);
                    for(var j=0; j < inventory.length; j++){
                        doc = formatdoc(inventory[j].product);
                        dbLocalInventory.put(doc).then(function(res){
                            scrapeItem(res.id)
                        }).catch(function(err){console.log("Error 1"); console.log(err)});
                        dbLocalMenus.get(doc["category"]).catch(function(err){
                            console.log(err);
                            dbLocalMenus.put({"_id" : doc["category"], "parent" : null});
                        })
                    }                
                } catch(err) {
                    console.log(err.message);
                    // console.log(script);
                    console.log("Scraping category list");
                    scrapeIt(url, {
                        catpath : {listItem : "#breadcrumbform a"},
                        categories : {
                            listItem : ".linkLine li", 
                            data : {
                                name : "a", url : {
                                    selector : "a", 
                                    attr : "href"}}  
                        }}).then(({data, response})=>{
                            console.log(data);
                            // foreach category in data.categories
                            //   is category.name in dbMenus?
                            //      no : Add category.name to dbMenus with current parent
                            //           Scrape category.url
                            var catpath = data.catpath.slice(1).join("|");
                            var parent = data.catpath[data.catpath.length-1];
                            for(var i = 0; i < data.categories.length; i++) {
                                var category = data.categories[i];
                                findOrAddCat(category, parent, catpath, function(newurl){
                                    scrapeCategory("https://www.menards.com/main/" + newurl)
                                });
                            }
                        }).catch(err=>{console.log("Trace:"); console.log(err)})
                }
            } else {
                // console.log(data.scripts[i]);
            }
        };
    });
}


function findOrAddCat(category, parent, catpath, callback)
{
    console.log("Category : " + category.name);
    console.log("Parent : " + parent);
    console.log("Catpath :" + catpath);
    dbLocalMenus.get(category.name).catch(err => {
        if(err.status==404){
            dbLocalMenus.put({"_id":category.name, "parent" : parent, "category" : catpath}).then(res => {
                callback(category.url)
            })
        }
    })
}


function formatdoc(doc)
{
    var newdoc = doc;
    newdoc._id = doc.name;
    newdoc.image = doc.images[0];
    newdoc.price = doc.price.value;
    newdoc.suppliersku = doc.sku;
    
    var categories = doc.category[0].split(" > ");
    addCat(categories);
    newdoc.category = categories[categories.length-1];
    newdoc.categorypath = doc.category[0];
    
    return newdoc;
}

var parentof = {};

function addCat(categories)
{
    for(var i = categories.length-1; i > 0; i--)
    {
        parentof[categories[i].trim()] = categories[i-1].trim();
        dbLocalMenus.get(categories[i].trim()).then(doc=>{console.log(doc)}).catch(err => {
            if(err.status==404) {
                console.log("Adding : " + err.docId + "with parent : " + parentof[err.docId]);
                dbLocalMenus.put({"_id" : err.docId, "parent" :parentof[err.docId], category : categories.join("|")})
            }
        })
    }
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
    dbLocalInventory.get(item).then(function(doc){
        scrapeIt("http:" + doc.url, itempagescrape).then(({data, response})=>{
            doc.modelnumber = data.modelnumber;
            doc.suppliersku = data.suppliersku;
            doc.price = data.pricedollars + "." + data.pricecents;
            doc.description = data.description;
            doc.specifications = data.specifications;
            // console.log(data);
            dbLocalInventory.put(doc).then(function(res){console.log(res)}).catch(function(err){console.log("Error 2"); console.log(err)})
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

dbLocalMenus.sync(dbRemoteMenus, {batch_size:5});

dbLocalInventory.sync(dbRemoteInventory, {batch_size:5});