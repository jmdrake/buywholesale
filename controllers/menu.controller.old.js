var db = new PouchDB("https://ttlyhatenewormonewistare:b714d61254fb4782ab1994111c49e44b86f94996@55644244-4beb-4ca8-b177-8ff6d5c3cc0b-bluemix.cloudant.com/menardsmenus"); 

function getDepartments(callback)
{
    var docs = [];
    db.allDocs({include_docs : true}).then(function(results){
        for(var i=0; i < results.rows.length; i++){
            docs[i] = results.rows[i].doc;
        }
        callback(docs)
    }).catch(function(err){callback(err)})
}

function getCategories(id, callback)
{
    db.get(id).then(function(doc){
        callback(doc.categories)
    }).catch(function(err){callback(err)})
}

function disableDepartment(department, callback) 
{
    db.get(department).then(function(doc){
        doc.disabled = true;
        db.put(doc).then(function(res){
            callback(res)
        }).catch(function(err){callback(err)})
    }).catch(function(err){callback(err)})
}

function enableDepartment(department, callback) 
{
    db.get(department).then(function(doc){
        doc.disabled = false;
        db.put(doc).then(function(res){
            callback(res)
        }).catch(function(err){callback(err)})
    })
}

function deleteDepartment(department, callback)
{
    db.get(department).then(function (doc) {
      return db.remove(doc);
    }).catch(function(err){callback(err)});
}

function addDepartment(department, callback)
{
    var doc = {"_id" : department, label : department, categories : [], disabled : false};
    db.put(doc).then(function(res){
        callback(res)
    }).catch(function(err){
        console.log(err)
    })
}

function disableCategory(department, category, callback) 
{
    db.get(department).then(function(doc){
        console.log(doc.disabled)
    }).catch(function(err){
        console.log(err);
    });
    db.get(department).then(function(doc){
        for(var i = 0; i < doc.categories.length; i++) {
            if(doc.categories[i].label == category)
                doc.categories[i].disabled = true;
        }
        db.put(doc).then(function(res){callback(res)}).catch(function(err){callback(err)})
    }).catch(function(err){callback(err)})
}

function enableCategory(department, category, callback) 
{
    db.get(department).then(function(doc){
        for(var i = 0; i < doc.categories.length; i++) {
            if(doc.categories[i].label == category)
                doc.categories[i].disabled = false;
        }
        db.put(doc).then(function(res){callback(res)}).catch(function(err){callback(err)})
    }).catch(function(err){callback(err)})
}

function deleteCategory(department, category, callback)
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

function addCategory(department, category, callback) 
{
    db.get(department).then(function(doc){
        db.categories[db.categories.length] = category;
        db.put(doc).then(function(res){callback(res)}).catch(function(err){callback(err)})
    }).catch(function(err){callback(err)})    
}

