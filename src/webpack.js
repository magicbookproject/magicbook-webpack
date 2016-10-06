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
      conf.output.path = path.join(process.cwd(), extras.destination, conf.output.path);
      console.log(conf.output.path)

      webpack(conf, function(err, stats) {
        // console.log(util.inspect(stats.toJson(true), false, null))
        // SET TO LIQUID LOCALS
        callback(err, config, extras);
      });

    } else {
      callback(null, config, extras);
    }
  }
}

module.exports = Plugin;
