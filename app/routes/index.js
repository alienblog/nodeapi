var fs = require('fs');

var dir = __dirname;

function getRoutes() {
	var files = fs.readdirSync(dir);
	var routes = {};
	for (var i in files) {
		var file = files[i];
		if (file == 'index.js') continue;
		var jsName = file.replace('.js', '');
		var route = require('./' + jsName);
		routes[jsName] = route;
	}
	return routes;
}

function registerRoutes(router) {
	var routes = getRoutes();

	for (var i in routes) {
		var route = routes[i];
		for (var mothedName in route) {
			var funs = route[mothedName];
			for (var path in funs) {
				var fun = funs[path];
				if (typeof fun == 'function') {
					if (route.prefix == '/')
						route.prefix = '';
					console.log(route.prefix + '/' + path);
					router[mothedName](route.prefix + '/' + path, fun);
				}
			}
		}
	}
}

module.exports = function (router) {
	registerRoutes(router);
}