var PouchDB = require("pouchdb");

var db = new PouchDB("menardsmenus");
var dbRemote = new PouchDB("https://ttlyhatenewormonewistare:b714d61254fb4782ab1994111c49e44b86f94996@55644244-4beb-4ca8-b177-8ff6d5c3cc0b-bluemix.cloudant.com/menardsmenus"); 

db.sync(dbRemote, {batch_size : 10});

exports.getDepartments = function(callback)
{
    var docs = [];
    db.allDocs({include_docs : true}).then(function(results){
        for(var i=0; i < results.rows.length; i++){
            docs[i] = results.rows[i].doc;
        }
        callback(docs)
    }).catch(function(err){console.log(err)})
}

exports.getCategories = function(id, callback)
{
    db.get(id).then(function(doc){
        callback(doc.categories)
    }).catch(function(err){console.log(err)})
}

exports.disableDepartment = function(department, callback) 
{
    db.get(department).then(function(doc){
        doc.disabled = true;
        db.put(doc).then(function(res){
            callback(res)
        }).catch(function(err){callback(err)})
    }).catch(function(err){console.log(err)})
}


exports.enableDepartment = function(department, callback) 
{
    db.get(department).then(function(doc){
        doc.disabled = false;
        db.put(doc).then(function(res){
            callback(res)
        }).catch(function(err){console.log(err)})
    })
}

exports.deleteDepartment = function(department, callback)
{
    db.get(department).then(function (doc) {
      return db.remove(doc);
    }).catch(function(err){console.log(err)});
}

exports.addDepartment = function(department, callback)
{
    var doc = {"_id" : department, label : department, categories : [], disabled : false};
    db.put(doc).then(function(res){
        callback(res)
    }).catch(function(err){
        console.log(err)
    })
}

exports.disableCategory = function(department, category, callback) 
{
    /* db.get(department).then(function(doc){
        console.log(doc.disabled)
    }).catch(function(err){
        console.log(err);
    }); */
    db.get(department).then(function(doc){
        for(var i = 0; i < doc.categories.length; i++) {
            if(doc.categories[i].label == category)
                doc.categories[i].disabled = true;
        }
        db.put(doc).then(function(res){callback(res)}).catch(function(err){callback(err)})
    }).catch(function(err){console.log(err)})
}

exports.disableAllCategories = function() 
{
    db.allDocs({include_docs : true}).then(function(results){
        for(var i=0; i < results.rows.length; i++){
            var doc = results.rows[i].doc;
            for(var j = 0; j < doc.categories.length; j++) {
                doc.categories[j].disabled = true;
            }
            db.put(doc).catch(function(err){console.log(err)})
        }
    })
}

exports.enableCategory = function(department, category, callback) 
{
    db.get(department).then(function(doc){
        var newdoc = doc;
        newdoc._rev = doc._rev;
        for(var i = 0; i < newdoc.categories.length; i++) {
            if(newdoc.categories[i].label == category)
                newdoc.categories[i].disabled = false;
        }
        db.put(newdoc).then(function(res){callback(res)}).catch(function(err){console.log("error 1 : "); callback(err)})
    }).catch(function(err){console.log("error 2 : "); callback(err)})
}

exports.deleteCategory = function(department, category, callback)
{
    db.get(department).then(function(doc){
        var index = -1;
        for(var i = 0; i < doc.categories.length; i++) {
            if(doc.categores[i].category == category)
                index = i;
        }
        if(index >= 0) {
            doc.categories.splice(index, 1);
            db.put(doc).then(function(res){callback(res)}).catch(function(err){callback(err)})
        }
    }).catch(function(err){callback(err)})
}

exports.addCategory = function(department, category, callback) 
{
    db.get(department).then(function(doc){
        db.categories[db.categories.length] = category;
        db.put(doc).then(function(res){callback(res)}).catch(function(err){callback(err)})
    }).catch(function(err){console.log(err)})    
}

