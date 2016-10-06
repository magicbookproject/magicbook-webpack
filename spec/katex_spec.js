var rimraf = require('rimraf');
var uuid = require('node-uuid');
var build = require('magicbook/src/build');
var fs = require('fs');
var _ = require('lodash');
var path = require('path');

function triggerBuild(config) {
  var uid = uuid.v4().replace('-', "").substring(0, 10);
  _.defaults(config, {
    layout: "book/layouts/default.html",
    addPlugins: ["./src/katex.js"],
    files: ["book/content/math.md"],
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

describe("Katex", function() {


  it("should convert markdown $$ to katex", function(done) {
    var uid = triggerBuild({
      builds: [{ format: "html" }],
      finish: function() {
        var content = fs.readFileSync(path.join('tmp', uid, 'build1/math.html')).toString();
        expect(content).toMatch("<span class=\"katex\"><span class=\"katex-mathml\"><math>");
        expect(content).toMatch("<span class=\"katex-display\"><span class=\"katex\"><span class=\"katex-mathml\"><math>");
        expect(content).not.toMatch("\\$\\$");
        done();
      }
    });
  });

  it("should convert html data-type=equation to katex", function(done) {
    var uid = triggerBuild({
      builds: [{ format: "html" }],
      files: ["book/content/moremath.html"],
      finish: function() {
        var content = fs.readFileSync(path.join('tmp', uid, 'build1/moremath.html')).toString();
        expect(content).toMatch("<span class=\"katex\"><span class=\"katex-mathml\"><math>");
        expect(content).toMatch("<span class=\"katex-display\"><span class=\"katex\"><span class=\"katex-mathml\"><math>");
        expect(content).not.toMatch("data-type=\"equation\"");
        done();
      }
    });
  });

  it("should include katex.css in the stylesheets", function(done) {
    var uid = triggerBuild({
      builds: [{ format: "html" }],
      finish: function() {
        fs.readFileSync(path.join('tmp', uid, 'build1/assets/katex.css'));
        done();
      }
    });
  });

  it("should include fonts in the fonts", function(done) {
    var uid = triggerBuild({
      builds: [{ format: "html" }],
      finish: function() {
        fs.readFileSync(path.join('tmp', uid, 'build1/assets/KaTeX_AMS-Regular.eot'));
        done();
      }
    });
  });

});
