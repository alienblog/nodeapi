var _ = require('lodash');

var defaultParams={page:1};
var param = defaultParams;
console.log(_.merge(param,{page:5}))
console.log(defaultParams)