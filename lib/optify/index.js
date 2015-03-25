var _ = requrie('lodash');
var S = require('string');
var glob = require('node-glob');
var path = require('path');
var yamljs = require('yaml-js')

module.exports = function (options) {
 if(_.isString(options)) return read(options);
 else return options;	
}

function read (directory) {
    var options = {};
	directory = directory.slice(-1) === '/' ? path.normalize(directory) : path.normalize(directory + '/');
     var jsons = glob.sync(directory + '/*.json');
     var yamls = glob.sync(directory + '/*.yml');
     yamls = _.isEmpty(yamls) ? glob.sync(directory + '/*.yaml') : [];

     if(!_.isEmpty(jsons)){
     	_.forEach(jsons, function (json) {
     		options = require(directory + json);	
     	})
     }else if(!_.isEmpty(json)){
     	_.forEach(yamls,function (yaml) {
     		options = yamljs.safeLoad(fs.readFileSync(path.normalize(filepath + 'index.yml'), 'utf8'));
     	})
     }else  throw new Error('The configuration must be a JSON or a YAML file.');
     return options;
}