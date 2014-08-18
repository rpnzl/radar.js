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
      if (!object[v]) return;
      object[v] = wrapInterface.apply(self, [object, v, options]);
    });

    return object;
  };


  /**
   *
   */

  function wrapInterface(object, methodName, options) {
    var events  = generateEvents(options, methodName)
      , method  = object[methodName]
      , self    = this;

    this.events = _.uniq(this.events.concat([events.before, events.after]));

    return (function isolate(object, methodName, method, options, events){
      return function () {
        var args = Array.prototype.slice.call(arguments);
        if (typeof args[args.length - 1] === "function") {
          asyncWrap.apply(self, [object, method, args, events]);
        } else {
          syncWrap.apply(self, [object, method, args, events]);
        }
      };
    }(object, methodName, method, options, events));
  }

  /**
   *
   */

  function syncWrap(object, method, args, events) {
    var self = this
      , result;

    this.emit(events.before, object, args);
    result = method.apply(object, args);
    setTimeout(function () {
      self.emit(events.after, object, [result]);
    }, 0);
  }

  /**
   *
   */

  function asyncWrap(object, method, oArgs, events) {
    var self = this
      , done = oArgs[oArgs.length - 1]
      , args = oArgs.slice(0, oArgs.length - 1)
      , result;

    async.waterfall([
      function emitBeforeEvent(cb) {
        self.emit(events.before, object, args);
        method.apply(object, args.concat(cb));
      },
      function emitAfterEvent() {
        var _args = Array.prototype.slice.call(arguments);
        done.apply(null, _args.slice(0, _args.length - 1));
        _args[_args.length - 1].apply(null, [null].concat(_args.slice(0, _args.length - 1)));
      }
    ], function () {
      if (err) done.apply(null, arguments);
      self.emit(events.after, object, arguments);
    });
  }

  /**
   *
   */

  function generateEvents(options, method) {
    var events = {};
    events.prefix = options.prefix ? options.prefix + options.separator : "";
    events.base   = events.prefix + method;
    events.before = "before" + options.separator + events.base;
    events.after  = "after" + options.separator + events.base;
    return events;
  }


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
