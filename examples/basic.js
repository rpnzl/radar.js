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
