var fs = require('fs');

var siteConfigPath = __dirname+'/../sites';

var getConfig = function(path){
    var json = fs.readFileSync(path,'utf8');
    return eval('('+json+')');
}

var getSiteNames = function(){
    var siteNames = [];
    var files = fs.readdirSync(siteConfigPath);
    for(var i = 0; i < files.length; i++){
        var file = files[i];
        var stat = fs.statSync(siteConfigPath+'/'+file);
        if(stat.isDirectory())
            siteNames.push(file);
    }
    return siteNames;
}

var getSiteConfig = function(siteName){
    var path = siteConfigPath+'/'+siteName+'/config.json';
    return getConfig(path);
}

var getPageRule = function(siteName,ruleName){
    var path = siteConfigPath+'/'+siteName+'/rules/'+ruleName+'.json';
    return getConfig(path);
}

module.exports = {
    getSiteConfig:getSiteConfig,
    getPageRule:getPageRule,
    getSiteNames:getSiteNames
}