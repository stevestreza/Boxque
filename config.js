var util = require('util');
var fs   = require('fs');
var path = require('path');

var tryPath = function(realPath, cb){
	fs.readFile("" + realPath, function(err, data){
		if(err){
			util.puts("Could not read file at " + realPath + ": " + util.inspect(err));
			cb(false, null);
		}else{
			try{
				var hash = JSON.parse(data);
				cb(true, hash);
			}catch(e){
				util.puts("Invalid config JSON at " + realPath);
				cb(false, null);
			}
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

exports.get = function(cb){
	tryPaths(["./config.json", "~/.boxque.json", "/etc/boxque.json"], function(success, data){
		if(!success){
			data = {};
		}
		
		cb(data);
	});
};