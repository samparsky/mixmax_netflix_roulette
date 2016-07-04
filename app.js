var express = require('express');
var bodyParser = require('body-parser');
var sync = require('synchronize');
var cors = require('cors');

var app = express();

app.use(function(req, res, next){
	sync.fiber(next);
});

var corOptions = {
	origin: /^[^.\s]+\.mixmax\.com$/,
  	credentials: true
};

var resolver = require('./app/resolver');
var typeahead = require('./app/typeahead');

app.get('/resolver',cors(corOptions), resolver);
app.get('/typeahead',cors(corOptions), typeahead);

app.listen(process.env.PORT || 3000);