var util = require('util');
var resque = require('coffee-resque');

var config = require('./config');

config.get(function(data){
	util.puts("Got configuration: " + util.inspect(data));

	var msg = process.argv[2];
	util.puts("Notification: " + msg);
});
