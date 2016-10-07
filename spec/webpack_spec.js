var rimraf = require('rimraf');
var uuid = require('node-uuid');
var build = require('magicbook/src/build');
var fs = require('fs');
var _ = require('lodash');
var path = require('path');

function triggerBuild(config) {
  var uid = uuid.v4().replace('-', "").substring(0, 10);
  _.defaults(config, {
    addPlugins: ["./src/webpack.js"],
    webpack: 'book/webpack.config.js',
    files: ["book/content/webpack.md"],
    destination: "tmp/"+uid+"/:build"
  });
  build(config);
  return uid;
}

beforeAll(function(done) {
  rimraf("tmp/*", function() {
    done();
  });
});

describe("Webpack", function() {

  it("should run webpack", function(done) {
    var uid = triggerBuild({
      builds: [{ format: "html" }],
      finish: function() {
        var content = fs.readFileSync(path.join('tmp', uid, 'build1/assets/bundle.js')).toString();
        expect(content).toMatch('hello')
        done();
      }
    });
  });

  it("should pass manifest to liquid", function(done) {
    var uid = triggerBuild({
      files: ["book/content/webpack.md", 'book/content/**/test.md'],
      builds: [{ format: "html" }],
      finish: function() {
        var file1 = fs.readFileSync(path.join('tmp', uid, 'build1/webpack.html')).toString();
        var file2 = fs.readFileSync(path.join('tmp', uid, 'build1/subfolder/test.html')).toString();
        expect(file1).toMatch('LINK: assets/bundle.js');
        expect(file2).toMatch('LINK: ../assets/bundle.js');
        done();
      }
    });
  });

});
