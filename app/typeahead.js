var config  = require('../config/config');
var request = require('request');
var sync = require('synchronize');
var  _   = require('underscore');

module.exports = function(req,res){

	var chapteres_api = '';
	var verses_api = '';

	var term = req.query.text.trim();
	console.log(term);

	if(!term){
		res.json({
			title: '<i>(enter a netflix movie title)</i>',
			text: '',
		});
		return;
	}

	return getList(res,term);
}

function getList(res,term){
	var API_URL = "http://netflixroulette.net/api/api.php?title="
	try {
		response = sync.await(request(API_URL+encodeURIComponent(term),sync.defer()).auth(config.api_key,'password',true));
	} catch(e){
		res.status(500).send('Error');
		return;
	}

	console.log(response.statusCode);
	console.log(response.body);

	if(response.statusCode !== 200 || !response.body){
		res.status(500).send({title: 'No results found', text: 'Sorry! We couldn\'t find a movie with that title!'});
		return;
	}
	
	var data = JSON.parse(response.body);	
	if(data.show_title){
		res.json([{
			title: '<i>'+data.show_title+'</i>',
			text: '<p> Release Year:' + data.release_year+'</p>',
		}]);
		return;
	} else {
		res.json({
			title: '<i>No results found</i>',
			text: '<p>Please check the movie title again</p>'
		});
		return;
	}
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
