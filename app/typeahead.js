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

	if(response.statusCode !== 200 || !response.body){
		res.status(500).send('Error');
		return;
	}

	// var results = _.chain((JSON.parse(response.body)).response.books)
	// 			.reject(function(item){
	// 				return !item.name || !item;
	// 			})
	// 			.map(function(item){
	// 				return {
	// 					text : item.name
	// 				}
	// 			}).value();
				
	if(results.length === 0){
		res.json([{
			title: '<i>(no results)</i>',
			text: ''
		}]);
	} else {
		res.json(results);
	}
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
