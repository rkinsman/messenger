//	array to console
exports.atc = function(arr){
	arr.forEach(function(el){
		console.log(el.from + " --> " + el.text);
	});
}
