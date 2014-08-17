var _     = require("lodash")
  , async = require("async");

/**
 *
 */

module.exports = (function(){

  /**
   *
   */

  var defaults = { separator: ":", methods: [] };


  /**
   *
   */

  function Radar(options) {
    options = options || {};
    if (typeof options !== "object" || options instanceof Array) {
      throw new Error("Radar constructor expects an object");
    }

    this.defaults  = _.merge({}, defaults, options);
    this.listeners = {};
    this.events    = [];
  }

  /**
   *
   */

  Radar.prototype.wrap = function (object, options) {
    var self = this;
    options = options || {};

    if (typeof object !== "object" || object instanceof Array) {
      throw new Error("Radar.wrap expects first argument to be an object");
    }

    if (typeof options !== "object" || options instanceof Array) {
      throw new Error("Radar.wrap expects second argument to be an object");
    }

    options = _.merge({ prefix: null }, this.defaults, options);

    if (!options.prefix) {
      throw new Error("Radar.wrap expects a prefix parameter");
    }

    options.methods = _.uniq(options.methods.concat(this.defaults.methods));
    options.methods.forEach(function (v) {
      var events = {}, objectMethod;
      if (!object[v]) return;
      objectMethod  = object[v];
      events.base   = (options.prefix ? options.prefix + options.separator : "") + v;
      events.before = "before" + options.separator + events.base;
      events.after  = "after" + options.separator + events.base;
      self.events   = _.uniq(self.events.concat([events.before, events.after]));

      object[v] = function () {
        var args = Array.prototype.slice.call(arguments)
          , done = args[args.length - 1];
        if (typeof done !== "function") return self.syncWrap(events, object, objectMethod, args);
        return self.asyncWrap(events, object, objectMethod, args.slice(0, args.length - 1), done);
      };
    });

    return object;
  };


  /**
   *
   */

  Radar.prototype.syncWrap = function (events, object, method, args) {
    var self = this, result;
    this.emit(events.before, object, args);
    result = method.apply(object, args);
    setTimeout(function () {
      self.emit(events.after, object, [result]);
    }, 0);
    return result;
  };


  /**
   *
   */

  Radar.prototype.asyncWrap = function (events, object, method, args, done) {
    var self = this;
    async.waterfall([
      function emitBeforeEvent(cb) {
        self.emit(events.before, object, args);
        method.apply(object, args.concat(cb));
      },
      function emitAfterEvent() {
        var args = [null].concat(Array.prototype.slice.call(arguments));
        args[args.length - 1].apply(object, args.slice(0, args.length - 1));
        self.emit(events.after, args);
      }
    ], done);
  };


  /**
   *
   */

  Radar.prototype.emit = function (name, object, args) {
    if (this.listeners.hasOwnProperty(name)) {
      this.listeners[name].forEach(function (v) {
        if (typeof v === "function") v.apply(object, args || []);
      });
    }
    return this;
  };


  /**
   *
   */

  Radar.prototype.before = function (name, handler) {
    var key = "before" + this.defaults.separator + name;
    if (!this.listeners.hasOwnProperty(key)) {
      this.listeners[key] = [];
    }
    this.listeners[key].push(handler);
    return this;
  };


  /**
   *
   */

  Radar.prototype.after = function (name, handler) {
    var key = "after" + this.defaults.separator + name;
    if (!this.listeners.hasOwnProperty(key)) {
      this.listeners[key] = [];
    }
    this.listeners[key].push(handler);
    return this;
  };


  /**
   *
   */

  return Radar;

}());
