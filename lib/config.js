var util   = require('util');
var fs     = require('fs');
var path   = require('path');
var boxcar = require('boxcar');

var resque = require('coffee-resque');

var tryPath = function(realPath, cb){
	fs.readFile("" + realPath, function(err, data){
//		util.puts("Data for path " + realPath + ": " + data);
		if(err){
			util.puts("Could not read file at " + realPath + ": " + util.inspect(err));
			cb(false, null);
		}else{
			var hash = null;
			try{
				var hash = JSON.parse(data);
			}catch(e){
				util.puts("Invalid config JSON at " + realPath + ": " + e);
			}
			cb((hash != null), hash);
		}
	});
};

var tryPaths = function(pathArray, cb){
	var tryNext = function(){
		if(pathArray.length == 0){
			cb(false, null);
			return;
		};
		
		var path = pathArray.splice(0,1);
		tryPath(path, function(success, data){
			if(success){
				cb(true, data);
			}else{
				tryNext();
			}
		});
	};
	tryNext();
};

exports.data   = null;
exports.resque = null;
exports.boxcar = null;

exports.get = function(cb){
	if(exports.data){
		cb(exports.data);
		return;
	}
	
	tryPaths([path.join(__dirname, "../config.json"), "~/.boxque.json", "/etc/boxque.json"], function(success, data){
		if(!success){
			data = {};
		}
		
		exports.data = data;
		
		cb(data);
	});
};

exports.resqueServer = function(cb){
	if(exports.resque){
		cb(exports.resque);
		return;
	}
	
	exports.get(function(data){
		if(data.resque){
			var server = resque.connect(data.resque);
			exports.resque = server;
			cb(server);
		}else{
			cb(null);
		}
	});
};

exports.boxcarProvider = function(cb){
	if(exports.boxcar){
		cb(exports.boxcar);
		return;
	}
	
	exports.get(function(data){
		if(data.boxcar){
			var provider = new boxcar.Provider(data.boxcar.apiKey, data.boxcar.apiSecret);
			provider.email = data.boxcar.email;
			exports.boxcar = provider;
			cb(provider);
		}else{
			cb(null);
		}
	});
};
