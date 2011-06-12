var util = require('util');
var configLoader = require('./config');

configLoader.resqueServer(function(resque){
	if(resque){
		var message = process.argv[2];
		resque.enqueue("boxcar", "sendNotification", [message]);
//		process.exit();
	}else{
		util.puts("Error: No Resque server found in configuration, aborting");
		process.exit(1);
	}
});