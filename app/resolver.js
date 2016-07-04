var config = require('../config/config');
var request = require('request');
var sync = require('synchronize');
var _ = require('underscore');

module.exports = function(req,res){
	var term = req.query.text.trim();
	return handleSearchQuery(term,req,res);
}

var formatString = function(term){
	var result;
	var data = term.split(":");
	if(data.length == 3){
		result = data[0]+"+"+data[1]+":"+data[2];
	} else if(data.length == 2){
		result = data[0]+"+"+data[1]+":1";
	} else if (data.length == 1){
		result = data+"+1"+":1";
	}
	console.log("formatString");
	console.log(result);
	return result;
}

var handleSearchQuery = function(term, req, res){
	var API_URL = "http://netflixroulette.net/api/api.php?title="
	var result;
	try {
		result = sync.await(request(API_URL+encodeURIComponent(term), sync.defer()));
	} catch(e){
		console.log(e);
		return;
		//return res.status(500).send(e);
	}

	var data = JSON.parse(result.body);
	//var data = JSON.parse(r_data).response.search.result.passages[0].text;
	if(data.poster){
		var html = '<div style="max-width:100%;min-width:100%;border:5px dotted #eee;padding:20px;">'+
		'<img src="'+data.poster+'" width="20%">'+
		'<h3>'+data.show_title+'</h3>'+
		'<p><i>Release Year: </i>'+data.release_year+'</p>'+
		'<p><i>Rating :</i>'+data.rating+'</p>'+
		'<p><i>Summary :</i>'+ data.Summary+'</p>'+
		'</div>';
	} else {
		var html = '<p> No results found </p>';
	}
	return res.json({"body":html});
}