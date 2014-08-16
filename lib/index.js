var _     = require("lodash")
  , async = require("async");

/**
 *
 */

module.exports = (function(){

  /**
   *
   */

  var defaults = {
    prefix:    "",
    separator: ":",
    methods:   []
  };


  /**
   *
   */

  function Radar(options) {
    options = options || {};

    if (typeof options !== "object" || options instanceof Array) {
      throw new Error("Radar constructor expects an object");
    }

    this.defaults  = _.merge(defaults, options);
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

    options = _.merge({}, this.defaults, options);
    options.methods.forEach(function (v) {
      var callbacks = [], eventName;
      if (!options.prefix) {
        options.prefix = __filename.split("/").pop().replace(/\.js$/, "").toLowerCase();
        if (options.prefix === "index") {
          options.prefix = __dirname.split("/").pop().toLowerCase();
        }
      }
      eventName = options.prefix + options.separator + v;
      if (object[v]) {
        self.events.push(eventName);
        callbacks.push(object[v]);
        object[v] = function (values, done) {
          if (typeof values === "function") {
            done   = values;
            values = null;
          }
          async.waterfall([
            function (cb) {
              self.emit(eventName, [values]);
              cb(null, values);
            }
          ].concat(callbacks), done);
        };
      }
    });
    return object;
  };


  /**
   *
   */

  Radar.prototype.emit = function (name, args) {
    if (this.listeners.hasOwnProperty(name)) {
      this.listeners[name].forEach(function (v) {
        if (typeof v === "function") v.apply(null, args || []);
      });
    }
    return this;
  };


  /**
   *
   */

  Radar.prototype.on = function (name, handler) {
    if (!this.listeners.hasOwnProperty(name)) {
      this.listeners[name] = [];
    }
    this.listeners[name].push(handler);
    return this;
  };


  /**
   *
   */

  return Radar;

}());
