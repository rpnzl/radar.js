# Radar.js

[![Build Status](https://travis-ci.org/rpnzl/radar.js.svg?branch=master)](https://travis-ci.org/rpnzl/radar.js)
[![NPM version](https://badge.fury.io/js/radar.js.svg)](http://badge.fury.io/js/radar.js)

A simple wrapper for objects that emits events *around* specified methods. It effectively
sandwiches object methods between two event emitters.


## Installation

    npm install radar.js


## Quick Start

```javascript
var Radar = require("./lib")
  , radar = new Radar({ methods: ["leave"] });

var bear = radar.wrap({
  name: "Bear",
  leave: function () {
    console.log(this.name + " is leaving...");
  },
  stay: function () {
    console.log(this.name + " is staying...");
  }
}, {
  prefix:  "bear",
  methods: ["stay"]
});

radar.before("bear:leave", function () {
  console.log(this.name + " is thinking about leaving...");
});

radar.after("bear:leave", function () {
  console.log(this.name + " left.");
});

radar.before("bear:stay", function () {
  console.log(this.name + " is thinking about staying...");
});

radar.after("bear:stay", function () {
  console.log(this.name + " stayed.");
});

bear.leave();
bear.stay();

// Bear is thinking about leaving...
// Bear is leaving...
// Bear is thinking about staying...
// Bear is staying...
// Bear left.
// Bear stayed.
```


## API

### Radar(options) [constructor]

Create a new Radar object with some optional configuration.

#### Usage

```javascript
var radar = new Radar();
var radar = new Radar({ methods: ["leave"] });
```

#### Arguments

name|required|type
----|--------|----
options|no|`obj`

#### Options

name|type|default|description
----|----|-------|-----------
separator|`str`|`":"`|separates the location (before, after), prefix, and method name
methods|`arr`|`[]`|list of methods to wrap, if they exist

### Radar.wrap(object, options)

Wraps designated methods within an object with before and after event emitters.

#### Usage

```javascript
var bear = radar.wrap({
  name:  "Bear",
  leave: function () {
    console.log(this.name + " is leaving...");
  }
}, { prefix: "bear" });

var fox = radar.wrap({
  name: "Fox",
  stay: function () {
    console.log(this.name + " is staying...");
  }
}, {
  prefix:    "fox",
  separator: "/"
  methods:   ["stay"]
})
```

#### Arguments

name|required|type
----|--------|----
object|yes|`obj`
options|yes|`obj`

#### Options

name|type|default|description
----|----|-------|-----------
prefix|`str`|`""`|prefixes the event names attached to this object
separator|`str`|`":"`|overrides the default separator for the `object` argument's events only
methods|`arr`|`[]`|list of additional methods to wrap for the `object` argument only

### Radar.before(eventName, handler)

Trigger handler *before* the wrapped method is called on the `object`. The context (`this`) within this
method is the `object` which the event was registered against.

#### Usage

```javascript
radar.before("bear:leave", function () {
  console.log(this.name + " is about to leave..."); // Bear is about to leave...
});
```

#### Arguments

name|required|type
----|--------|----
eventName|yes|`str`
handler|yes|`func`

### Radar.after(eventName, handler)

Trigger handler *after* the wrapped method is called on the `object`. The context (`this`) within this
method is the `object` which the event was registered against.

#### Usage

```javascript
radar.after("bear:leave", function () {
  console.log(this.name + " left."); // Bear left.
});
```

#### Arguments

name|required|type
----|--------|----
eventName|yes|`str`
handler|yes|`func`
