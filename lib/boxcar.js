var util = require('util');
var configLoader = require('./config');

exports.priorities = {
	CRITICAL: 0,
	HIGH: 1,
	NORMAL: 2,
	LOW: 3
};

exports.sendNotification = function(message, priority, email, cb){
	configLoader.resqueServer(function(resque){
		if(resque){
			resque.enqueue("boxcar", "sendNotification", [message]);
			resque.end();
			cb(true);
		}else{
			util.puts("Error: No Resque server found in configuration, aborting");
			cb(false);
		}
	});
};
