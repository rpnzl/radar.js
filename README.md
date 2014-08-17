# Radar.js

[![Build Status](https://travis-ci.org/rpnzl/radar.js.svg?branch=master)](https://travis-ci.org/rpnzl/radar.js)
[![NPM version](https://badge.fury.io/js/radar.js.svg)](http://badge.fury.io/js/radar.js)

A simple wrapper for objects that emits events *around* specified methods. It effectively
sandwiches object methods between two event emitters.

## Installation

    npm install radar.js

## Usage

```javascript
var Radar = require("radar.js")
  , radar = new Radar({ methods: ["syncMethod", "asyncMethod"] })
  , user;

// define object
user = radar.wrap({
  syncMethod:  function (name) { return "SYNC RESULT: " + name },
  asyncMethod: function (name, done) { done(null, "ASYNC RESULT: " + name); }
}, { prefix: "user" });

// sync
radar.before("user:syncMethod", function (name) {
  console.log(name);
});

radar.after("user:syncMethod", function (result) {
  console.log(result);
});

// async
radar.before("user:asyncMethod", function (name) {
  console.log(name);
});

radar.after("user:asyncMethod", function (result) {
  console.log(result);
});

// triggers
console.log(user.syncMethod("joe"));
user.asyncMethod("joe", function (err, result) {
  console.log(result)
});
```


## API

### Radar(options) [constructor]

Create a new Radar object with some optional configuration.

#### Usage

```javascript
var radar = new Radar();
var radar = new Radar({ separator: "/" });
```

#### Options

|name|type|default|description|
|prefix|`str`|`""`|prefixes an event name, unless overridden using `Radar.wrap()`|
|separator|`str`|`":"`|separates the location (before, after), prefix, and method name|
|methods|`arr`|`[]`|a default list of methods to wrap|

### Radar.wrap(object, options)

Wraps designated methods within an object with before and after event emitters.
