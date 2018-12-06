var PouchDB = require("pouchdb");
// var db = new PouchDB("https://ttlyhatenewormonewistare:b714d61254fb4782ab1994111c49e44b86f94996@55644244-4beb-4ca8-b177-8ff6d5c3cc0b-bluemix.cloudant.com/buywholesalemenus"); 
var dbRemote = new PouchDB("https://ttlyhatenewormonewistare:b714d61254fb4782ab1994111c49e44b86f94996@55644244-4beb-4ca8-b177-8ff6d5c3cc0b-bluemix.cloudant.com/menardsinventory");
var dbLocal = new PouchDB("menardinventory");
var scrapeIt = require("scrape-it");
var urlExists = require('url-exists');

// dbLocal.sync()
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
        console.log("WTF?");
        console.log(data.links.length);
        for(var i=0; i < data.links.length; i++){
            scrapeCategory("https:" + data.links[i].url);
            console.log("https:" + data.links[i].url);
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
    scrapeIt(url, {scripts : {listItem : "script"}}).then(({data, response})=>{
        for(var i = 0; i < data.scripts.length; i++)
        {
            var match;
            var start;
            var script = data.scripts[i];
            var doc;
            var scraped = false;
            
            if(typeof script == 'string' && (start = script.indexOf("var qubitEcProduct")) > 0)
            {
                var end = script.indexOf("}];", start);
                try{
                    var qubitEcProductStr = script.slice(start + 20, end+2).trim();
                    if(qubitEcProductStr != "") {
                        scraped = true;
                        var inventory = JSON.parse(qubitEcProductStr);
                        console.log(inventory);
                        var meta = strBetween(script, "var qubitEcView =", "};");
                        for(var j=0; j < inventory.length; j++){
                            doc = formatdoc(inventory[j].product);
                            dbLocal.put(doc).then(function(res){
                                scrapeItem(res.id)
                            }).catch(function(err){console.log("Error 1"); /* console.log(err)*/})
                        }                
                        // console.log("Scraping");
                    }
                } catch(err) {
                    console.log("Error 2");
                    console.log(err.message);
                }
            } 
        }
        if(!scraped){
            console.log("Scrapting tit : " + url);
            scrapeIt(url, linkscrape).then(({data, response})=>{
                console.log(data.links);
                for(var j = 0; j < data.links.length; j++){
                    scrapeCategory("https://www.menards.com/main/" + data.links[j].url);
                }
            })
        }
    });
}

function formatdoc(doc)
{
    var newdoc = doc;
    newdoc._id = doc.name;
    newdoc.image = doc.images[0];
    newdoc.price = doc.price.value;
    newdoc.suppliersku = doc.sku;
    newdoc.department = doc.category[0].split(">")[0].trim();
    newdoc.category = doc.category[0].split(">")[1].trim();
    return newdoc;
}

var itempagescrape = {
    modelnumber : {
        selector : ".itemBasicInfoPadding",
        convert : x => x == '' ? x : x.split(/:/)[1].split(/\n/)[0].trim()
    },
    suppliersku : {
        selector : ".itemBasicInfoDivider",
        convert : x => x.match(/SKU/) ? x.split(/:/)[1].split(/\n/)[0].trim() : ''
        // convert : x => getSku(x)
    },
    pricedollars : ".priceBigVal",
    pricecents : ".centsVal",
    description : {
        selector : "#itemDetailPageDetails .expandThisSection",
        convert : x => x == '' ? x : removeblanks(x.split(/\n\t*/)),
        eq : 2
    }, 
    specifications : {
        selector : "#itemDetailPageDetails .expandThisSection",
        eq : 3,
        convert : x => x == '' ? x :  removeblanks(x.split(/\n\t*/)),
    }
}

var categoryscrape = {
    scripts : {listItem : "scripts"},
    links: { 
        listItem: ".noListStyle > li" , 
        data: { 
            name: "a", 
            url: {
                selector:"a", 
                attr: "href"
            }  
        } 
    }
}

var linkscrape = {
    links: { 
        listItem: ".noListStyle > li" , 
        data: { 
            name: "a", 
            url: {
                selector:"a", 
                attr: "href"
            }  
        } 
    }
}

function wait(ms)
{
    var stop = Date.now() + ms;
    while(Date.now() < stop);
}

function scrapeItem(item)
{
    dbLocal.get(item).then(function(doc){
        var url = "https:" + doc.url;
        if(doc.description == undefined | doc.description == '') {
            urlExists(url, function(err, exists) {
                if(exists)
                {
                    scrapeIt("https:" + doc.url, itempagescrape).then(({data, response})=>{
                        doc.modelnumber = data.modelnumber;
                        doc.description = data.description;
                        doc.specifications = data.specifications;
                        console.log("Url: " + doc.url);
                        console.log("Item : " + doc._id);
                        //console.log("Description");
                        console.log(data);
                        dbLocal.put(doc).catch(function(err){console.log("Error 3"); console.log(err)})
                    })
                } else {
                    console.log("Not found : " + url)
                }
            });
        }
    }).catch(function(err){console.log("Error 4"); console.log(err)});
}

function scrapeItems()
{
    dbLocal.allDocs({include_docs : true}).then(function(results){
        for(var i = 0; i < results.rows.length; i++){
            if(results.rows[i].doc.description == '')
                scrapeItem(results.rows[i].doc._id)
        }
    })
}

function testScrape(url)
{
    scrapeIt(url, itempagescrape).then(({data, response})=>{
        console.log(data);
    })
}

function checkItems(category)
{
    dbLocal.allDocs({include_docs : true}).then(function(results){
        for(var i = 0; i < results.rows.length; i++){
            var doc = results.rows[i].doc;
            if(doc.category == category & doc.description == '')
                console.log(results.rows[i].doc)
        }
    })
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

function dumpDoc(id)
{
    dbLocal.get(id).then(function(doc){console.log(doc)})
}

function dumpTable()
{
    dbLocal.allDocs({include_docs : true}).then(function(res){console.log(res)})
}

