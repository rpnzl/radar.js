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
        var model = new Radar().wrap("string", { prefix: "string" });
      }).should.throw();
    });

    it("should throw an error when arg is an array", function () {
      (function(){
        var model = new Radar().wrap([], { prefix: "array" });
      }).should.throw();
    });

    it("should throw an error when arg is a function", function () {
      (function(){
        var model = new Radar().wrap(function(){}, { prefix: "function" });
      }).should.throw();
    });

    it("should return an object", function () {
      (new Radar().wrap({}, { prefix: "object" })).should.be.an.Object;
    });

    it("should register a 'before' event", function () {
      var radar = new Radar({ methods: ["hello"] })
        , model = radar.wrap({ hello: function () {} }, { prefix: "user" });
      radar.events.should.containEql("before:user:hello");
    });

    it("should register an 'after' event", function () {
      var radar = new Radar({ methods: ["hello"] })
        , model = radar.wrap({ hello: function () {} }, { prefix: "user" });
      radar.events.should.containEql("after:user:hello");
    });
  });

});
