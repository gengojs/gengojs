var _ = require('lodash'),
  path = require('path'),
  root = require('app-root-path'),
  /* Defaults */
  parser =  require(path.normalize(root + '/plugins/parser/default')),
  api = require(path.normalize(root + '/plugins/api/')),
  apply = require(path.normalize(root + '/plugins/apply/')),
  config = require(path.normalize(root + '/plugins/config/')),
  memory = require(path.normalize(root + '/plugins/memory/')),
  router = require(path.normalize(root + '/plugins/router/')),
  accept = require(path.normalize(root + '/plugins/accept/'));
  localize = require(path.normalize(root + '/plugins/localize/'));

module.exports = function plugify(plugins) {
  var result = [];
  if (plugins) {
    _.forEach(plugins, function(plugin) {
      plugin = plugin();
      switch (plugin.package.type) {
        case 'parser':
          if (plugin.package.name !== parser.package.name) result.push(plugin);
          else result.push(parser());
          break;
        case 'accept':
          if (plugin.package.name !== accept.package.name) result.push(plugin);
          else result.push(accept());
          break;
        case 'backend':
          if (plugin.package.name !== backend.package.name) result.push(plugin);
          else result.push(backend());
          break;
        case 'router':
          if (plugin.package.name !== router.package.name) result.push(plugin);
          else result.push(router());
          break;
        case 'localize':
          if (plugin.package.name !== localize.package.name) result.push(plugin);
          else result.push(localize());
          break;
        case 'apply':
          if (plugin.package.name !== apply.package.name) result.push(plugin);
          else result.push(apply());
          break;
        case 'api':
          if (plugin.package.name !== api.package.name) result.push(plugin);
          else result.push(api());
          break;
      }
      //remove any duplicates
      result = _.uniq(result, false, function(plugin) {
        return plugin.package.name;
      });
    });
  } else result = [parser(), api(), apply(), config(), memory(), router(), accept(), localize()];
  return result;
};