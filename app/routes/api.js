var pathToRegexp = require('path-to-regexp');
var _ = require('lodash');
var Route = require('../common/route');
var siteManager = require('../common/siteManager');
var siteSpider = require('../common/siteSpider');

var api = new Route();

var siteNames = siteManager.getSiteNames();

function copy(p){
    var c = {};
    for (var i in p){
        c[i] = p[i];
    }
    c.uber = p;
    return c;
}

function addApi(siteName){
	var siteConfig = siteManager.getSiteConfig(siteName);
	var prefix = siteName+'/';
	for(var ruleName in siteConfig.rules){
		var rule = siteConfig.rules[ruleName];
		var url = prefix + rule.path;
		var toPath = pathToRegexp.compile(rule.url);
		api.get[url] = function*(next){
			var params = this.params;
			if(rule.defaultParams){
				var defaultParams = copy(rule.defaultParams);
				params = _.merge(defaultParams,params);
			}
			console.log(rule.defaultParams,params);
			var result = yield siteSpider(siteName,rule.ruleName||ruleName,toPath(params));
			this.type = 'application/json';
			this.body = result;
		}
	}
}

for(var i = 0; i < siteNames.length; i++){
	addApi(siteNames[i]);
}

module.exports = api;