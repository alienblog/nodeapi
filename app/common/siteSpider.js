var ng = require('nodegrass');
var cheerio = require('cheerio');
var jQuery = require('jquery');
var jsdom = require('jsdom').jsdom;
var siteManager = require('./siteManager');

var reqHeaders = {
	'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:45.0) Gecko/20100101 Firefox/45.0'
};

var download = (function (url) {
	return function (cb) {
		ng.get(url, function (data, status, headers) {
			console.log(status);
			console.log(headers);
			cb(null, data);
		}, reqHeaders, 'utf8').on('error', function (e) {
			console.log(e);
			cb(e, null);
		});
	}
});

var parseProcess = (function($,$$,pageRule){
	var fieldProcessers = {
		"string":function(value,fieldRule){
			if(fieldRule.postReplace){
				for(var i = 0;i < fieldRule.postReplace.length;i++){
					var rule = fieldRule.postReplace[i];
					var origin = rule.origin;
					if(rule.isReg)
						origin = new RegExp(origin);
					value = value.replace(origin,rule.newstr);
				}
			}
			return value;
		},
		"number":function(value,fieldRule){
			return value*1;
		}
	}
	
	var processers = {
		"array":function($el,rule){
			var $els = $el;
			if(rule.selector)
				$els = $el.find(rule.selector);
			var result = [];
			for(var i = 0; i < $els.length; i++){
				if(rule.content)
					result.push(runner($($els[i]),rule.content))
			}
			return result;
		},
		"object":function($el,rule){
			var fieldRules = rule.fields; 
			var obj = {};
			for(var fieldName in fieldRules){
				try {
					var fieldRule = fieldRules[fieldName];
					
					if(fieldRule.type == 'object'||fieldRule.type == 'array'){
						obj[fieldName] = runner($el,fieldRule);
						continue;
					}
					
					var $fieldEl = $el;
					if(fieldRule.selector)
						$fieldEl = $el.find(fieldRule.selector);
					
						
					var value;
					if(fieldRule.param)
						value = $fieldEl[fieldRule.place](fieldRule.param);
					else
						value = $fieldEl[fieldRule.place]();
					if(value){
						var fieldProcesser = fieldProcessers[fieldRule.type];
						if(fieldProcesser){
							value = fieldProcesser(value,fieldRule);
						}
						obj[fieldName] = value;
					}
				} catch (e) {
					console.log("error on fieldName:"+fieldName," exception:"+e);
				}
			}
			return obj;
		}
	};
	
	var runner = function($el,rule){
		var processer = processers[rule.type];
		if(processer){
			return processer($el,rule);
		}
		return null;
	}
	
	return function(cb){
		try {
			var result = runner($$,pageRule.content);
			cb(null,result);
		} catch (e) {
			cb(e,null);
		}
	}
});


var getResult = (function (siteName, ruleName, url) {
	var rule = siteManager.getPageRule(siteName,ruleName);
	return function *(cb) {
		var html = yield download(url);
		//var $ = cheerio.load(html);
		var doc = jsdom(html);
		var $ = jQuery(doc.defaultView);
		var result = yield parseProcess($,$('body'),rule);

		return result;
	}
});


module.exports = (function (siteName,ruleName,url) {
	return function *(cb) {
		var result = yield getResult(siteName, ruleName, url);
		return result;
	}
})