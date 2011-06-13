var util = require('util');
var configLoader = require('./config');

exports.beginWorker = function(cb){
	configLoader.resqueServer(function(resque){
		var worker = resque.worker("boxcar", {
			sendNotification: function(message, cb){
				util.puts("Notification! " + message);
				configLoader.boxcarProvider(function(boxcar){
					boxcar.notify(boxcar.email, message);
					cb();
				});
			}
		});
		
		worker.on('job', function(worker, queue, job) {
			util.puts("Job! " + util.inspect(job));
		});
	
		// Triggered every time a Job errors.
		worker.on('error', function(err, worker, queue, job) {
			util.puts("Error! " + err);
		});
	
		// Triggered on every successful Job run.
		worker.on('success', function(worker, queue, job, result) {
			util.puts("Success!");
		});
		
		worker.start();
		cb(worker);
	});
};
