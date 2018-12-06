function cloneDiv(template, record, options){
    var newDiv = template.clone();
    json2div(newDiv, record, options);
    return newDiv
}

function populateDivList(div, data, template, options){
	if(options != undefined) {
		var callback = options["callback"];		
		var prepend = options["prepend"];
		var final = options["final"];
		var rowset = options["rowset"];
	}	    
	var newDiv;
	if(rowset == undefined) {
	   for (var i = 0; i < data.length; i++) {
			newDiv = cloneDiv(template, data[i], options);
			if(prepend == undefined)
				div.append(newDiv);
			else 
				div.prepend(newDiv);
			newDiv.show();
			if(callback != undefined)
				callback(newDiv, data[i]);
		}
	} else {
		var i = 0, col = 0;
		var newRow;
		while(i < data.length)
		{
			if(i % rowset.size == 0) {
				newRow = rowset.row.clone();
				newRow.html("");
				div.append(newRow);
			}
			newDiv = cloneDiv(template, data[i], options);
			newRow.append(newDiv);
			newDiv.show();
			i++;
		}
	}
	if(final != undefined)
		final();
}

function populateList(list, data, key){
    var newLI;
    for (var i = 0; i < data.length; i++) {
        newLI = document.createElement("LI");
        newLI.innerHTML = unescape(data[i][key]);
        list.append(newLI);
    }
}

function populateComponents(div, data, template, options){
   var newDiv;
   for (var i = 0; i < data.length; i++) {
		newDiv = cloneDiv(template, JSON.parse(data[i]), options);
		div.append(newDiv);
	}
}