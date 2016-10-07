var webpack = require("webpack");
var fs = require('fs');
var _ = require("lodash");
var path = require('path');
var util = require('util');
var through = require('through2');

var Plugin = function(registry) {
  registry.before('load', 'webpack:run', this.run);
  registry.before('liquid', 'webpack:insert', this.insert);
}

Plugin.prototype = {

  // Run webpack and put the resulting output into a
  // manifest object
  run: function(config, extras, callback) {

    // If the configuration file has a webpack property
    // with a link to the config file
    if(config.webpack) {

      var that = this;
      this.manifest = {};

      // Require the config file relative to the process
      // and make a copy to not mess up between tests.
      var loadPath = path.join(process.cwd(), config.webpack);
      var conf = _.cloneDeep(require(loadPath));

      // Entries should be loaded relative to the config file
      conf.context = path.dirname(loadPath);

      // Output should be relative to the build folder
      var oldPath = conf.output.path;
      conf.output.path = path.join(process.cwd(), extras.destination, oldPath);

      // Run webpack
      webpack(conf, function(err, stats) {

        if(err) return callback(null, config, extras);

        // Parse output files into a manifest object
        var json = stats.toJson();
        _.each(json.assetsByChunkName, function(v, k) {
          that.manifest[k] = path.join(oldPath, v);
        });

        callback(null, config, extras);
      });

    } else {
      callback(null, config, extras);
    }
  },

  // Loop through each file and add the relative link to the
  // manifest files.
  insert: function(config, stream, extras, callback) {

    var manifest = this.manifest;

    // add the locals to the files liquidLocals
    stream = stream.pipe(through.obj(function(file, enc, cb) {

      _.each(manifest, function(filename, k) {
        var rel = path.relative(path.dirname(file.relative), filename);
        _.set(file, 'layoutLocals.webpack.' + k, rel);
        _.set(file, 'pageLocals.webpack.' + k, rel);
      });

      cb(null, file);
    }));

    callback(null, config, stream, extras);
  }
}

module.exports = Plugin;
