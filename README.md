# Waterline Radar

[![Build Status](https://travis-ci.org/rpnzl/radar.js.svg?branch=master)](https://travis-ci.org/rpnzl/radar.js)
[![NPM version](https://badge.fury.io/js/radar.js.svg)](http://badge.fury.io/js/radar.js)

A simple wrapper for Waterline models that emits events on lifecycle callbacks.

## Installation

    npm install waterline-radar

## Usage

    /**
     * app.js (one pager)
     */

    var radar  = require("waterline-radar");
    var config = radar.wrap({ ... }, { prefix: "user" });
    var User   = Waterline.Collection.extend(config);

    radar.on("user:afterCreate", function (model) {
      console.log("User created:", model);
    });

    /**
     * sails.js
     */

    // config/_.js (a config file that gets processed first)
    global["radar"] = require("waterline-radar");

    // api/models/User.js
    module.exports = radar.wrap({ ... }, { prefix: "user" });

    // api/hooks/Emails.js
    module.exports = function Emails(sails) {
      return {
        initialize: function (done) {
          radar.on("user:afterCreate", function (model) {
            // ... send email to `model.email`
          });
        }
      }
    };

## Details

Radar works by wrapping the model's lifecycle callback methods in an `async.waterfall`
and injecting the event emitter at the top of the list, like this...

    async.waterfall([
      radarEmitter,
      lifecycleCallback // if it exists
    ], done);

Radar wraps the lifecycle callbacks listed in the [Waterline docs](https://github.com/balderdashy/waterline#lifecycle-callbacks).
