// var db = new PouchDB("https://ttlyhatenewormonewistare:b714d61254fb4782ab1994111c49e44b86f94996@55644244-4beb-4ca8-b177-8ff6d5c3cc0b-bluemix.cloudant.com/menardsmenus"); 
var dbMenus = new PouchDB("https://forkshgressithervionally:fbe37c1a9cc85dc7f6eb7bcb9bd29aae4870beed@55644244-4beb-4ca8-b177-8ff6d5c3cc0b-bluemix.cloudant.com/menardsmenusv2"); 

function getDepartments(callback)
{
    var docs = [];
    dbMenus.allDocs({include_docs : true}).then(function(results){
        for(var i=0; i < results.rows.length; i++){
            if(results.rows[i].doc.parent==null) {
                var doc = results.rows[i].doc;
                doc["name"] = doc["_id"];
                docs[docs.length] = doc;
            }
                
        }
        callback(docs)
    }).catch(function(err){callback(err)})
}

function getCategories(id, callback)
{
    var docs = [];
    dbMenus.allDocs({include_docs : true}).then(function(results){
        for(var i=0; i < results.rows.length; i++){
            if(results.rows[i].doc.parent == id) {
                docs[docs.length] = results.rows[i].doc;
            }
        }
        callback(docs)
    }).catch(function(err){callback(err)})
}

function disableDepartment(department, callback) 
{
    dbMenus.get(department).then(function(doc){
        doc.disabled = true;
        dbMenus.put(doc).then(function(res){
            callback(res)
        }).catch(function(err){callback(err)})
    }).catch(function(err){callback(err)})
}

function enableDepartment(department, callback) 
{
    dbMenus.get(department).then(function(doc){
        doc.disabled = false;
        dbMenus.put(doc).then(function(res){
            callback(res)
        }).catch(function(err){callback(err)})
    })
}

function deleteDepartment(department, callback)
{
    dbMenus.get(department).then(function (doc) {
      return dbMenus.remove(doc);
    }).catch(function(err){callback(err)});
}

function addDepartment(department, callback)
{
    var doc = {"_id" : department, label : department, categories : [], disabled : false};
    dbMenus.put(doc).then(function(res){
        callback(res)
    }).catch(function(err){
        console.log(err)
    })
}


