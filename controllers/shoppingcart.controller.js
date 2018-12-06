var dbInventory = new PouchDB("https://ttlyhatenewormonewistare:b714d61254fb4782ab1994111c49e44b86f94996@55644244-4beb-4ca8-b177-8ff6d5c3cc0b-bluemix.cloudant.com/buywholesaleinventory");
var dbCart = new PouchDB("shppingcart");

function addToCart(itemname, qty, callback)
{
    if(qty > 0) {
        dbInventory.get(itemname).then(item => {
            dbCart.get(itemname).then(cartitem => {
                return dbCart.put({
                    _id : itemname,
                    _rev : cartitem._rev,
                    price : item.price,
                    qty : qty,
                })
            }).then(function(res){
                callback(res)
            }).catch(err => {
                if(err.status == 404){
                    dbCart.put({
                        _id : itemname,
                        qty : qty,
                        price : item.price
                    }).then(function(res){callback(res)})
                } else {
                    callback(err)
                }
            })
        });
    } else {
        dbCart.get(itemname).then(cartitem => {
            return dbCart.remove(cartitem)
        }).then(function(res){
            callback(res)
        }).catch(function(err){
            callback(err)
        })
    }
}

function getCartItems(callback)
{
    var items = [];
    dbCart.allDocs({include_docs : true}).then(res =>{
        for(var i = 0; i < res.rows.length; i++){
            items.push(res.rows[i].doc)
        }
        callback(items)
    }).catch(err=>{
        callback(err)
    })
}

function emptyCart(callback)
{
    dbCart.destroy().then(res =>{
        dbCart = new PouchDB("shppingcart");
    })
}

function checkout(callback)
{
    
}