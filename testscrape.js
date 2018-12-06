const scrapeIt = require("scrape-it")

function removeblanks(a)
{
    var newa = [];
    for(var i = 0; i < a.length; i++){
        if(a[i]!='')
            newa[newa.length] = a[i]
    }
    return newa;
}

function strBetween(string, strStart, strEnd)
{
    var posStart = string.indexOf(strStart) + strStart.length;
    var posEnd = string.indexOf(strEnd) + strEnd.length;
    return string.slice(posStart, posEnd);
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
                try{
                    var qubitEcProductStr = script.slice(start + 20, end+2).trim();
                    if(qubitEcProductStr != "") {
                        var inventory = JSON.parse(qubitEcProductStr);
                        var meta = strBetween(script, "var qubitEcView =", "};");
                        for(var j=0; j < inventory.length; j++){
                            doc = formatdoc(inventory[j].product);
                            scrapeItem(doc.url);
                        }                
                    }
                } catch(err) {
                    console.log(err.message);
                }
            } else {
                
            }
        }
    });
}


// Promise interface
function scrapeItem(url)
{
    scrapeIt("https:" + url, itempagescrape).then(({data, response})=>{
        console.log("Sku" + data.suppliersku);
        if(!data.suppliersku.match(/^\d+$/))
            console.log(data);
    })
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

function getSku(str){var strparsed = str.split(/:/); var key=strparsed[0]; if(key.match(/SKU/)) {return strparsed[1].split(/\n/)[0].trim()} else {return ''}}

console.log(process.argv[2]);
scrapeCategory(process.argv[2]);