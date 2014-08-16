/*jshint -W030 */

var assert = require("assert")
  , Radar = require("root-require")("lib");

describe("radar.js", function () {

  describe("#constructor()", function () {
    it("should throw an error when arg is a string", function () {
      (function(){
        var radar = new Radar("string");
      }).should.throw();
    });

    it("should throw an error when arg is an array", function () {
      (function(){
        var radar = new Radar([]);
      }).should.throw();
    });

    it("should throw an error when arg is a function", function () {
      (function(){
        var radar = new Radar(function () {});
      }).should.throw();
    });

    it("should accept a default prefix", function () {
      var prefix = "somecoolprefix"
        , radar  = new Radar({ prefix: prefix });
      radar.defaults.prefix.should.equal(prefix);
    });

    it("should accept a default separator", function () {
      var separator = "/"
        , radar     = new Radar({ separator: separator });
      radar.defaults.separator.should.equal(separator);
    });

    it("should accept an array of default methods", function () {
      var methods = ["methodToTrack", "anotherMethodToTrack"]
        , radar   = new Radar({ methods: methods });
      radar.defaults.methods.should.eql(methods);
    });
  });

  describe("#wrap()", function () {
    it("should throw an error when first arg is a string", function () {
      (function(){
        var model = new Radar().wrap("string");
      }).should.throw();
    });

    it("should throw an error when arg is an array", function () {
      (function(){
        var model = new Radar().wrap([]);
      }).should.throw();
    });

    it("should throw an error when arg is a function", function () {
      (function(){
        var model = new Radar().wrap(function(){});
      }).should.throw();
    });

    it("should return an object", function () {
      (new Radar().wrap({})).should.be.an.Object;
    });
  });

});
