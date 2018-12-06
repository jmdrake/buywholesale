db.query(function (doc, emit) {
  for(var i = 0; i < doc.categories.length; i++){
    emit(doc.categories[i].label)
  }  
}, {key: 'foo'}).then(function (result) {
  // console.log(result)
}).catch(function (err) {
  // handle any errors
});

function myMapFunction(doc) {
  for(var i = 0; i < doc.categories.length; i++){
    emit(doc.categories[i].label)
  }  
}

var myMapReduceFun = {
  map: function (doc) {
    emit(doc.category);
  },
  reduce: '_count'
};

dbInventory.query(myMapReduceFun, {
  reduce: true, group: true
}).then(function (result) {
  // handle result
}).catch(function (err) {
  // handle errors
});