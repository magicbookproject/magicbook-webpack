var webpack = require("webpack");
var fs = require('fs');
var _ = require("lodash");
var path = require('path');
var util = require('util');

var Plugin = function(registry) {
  registry.before('load', 'webpack:run', this.run);
}

Plugin.prototype = {

  run: function(config, extras, callback) {

    if(config.webpack) {

      var loadPath = path.join(process.cwd(), config.webpack);
      var conf = require(loadPath);

      // So entries load relative to the conf file
      conf.context = path.dirname(loadPath);
      // So output is relative to the build
      var oldPath = conf.output.path;
      conf.output.path = path.join(process.cwd(), extras.destination, oldPath);

      webpack(conf, function(err, stats) {
        if(err) return callback(null, config, extras);

        var json = stats.toJson();
        var manifest = {};
        _.each(json.assetsByChunkName, function(v, k) {
          manifest[k] = path.join(oldPath, v);
        });
        
        // SET TO LIQUID LOCALS
        callback(null, config, extras);
      });

    } else {
      callback(null, config, extras);
    }
  }
}

module.exports = Plugin;
