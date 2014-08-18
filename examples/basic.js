var Radar = require("../lib")
  , radar = new Radar({ methods: ["leave"] });

var bear = radar.wrap({
  name: "Bear",
  leave: function (done) {
    console.log(this.name + " is leaving...");
    setTimeout(done, 3000);
    // done("LEAVAMUNDO");
  },
  stay: function () {
    console.log(this.name + " is staying...");
  }
}, {
  prefix:  "bear",
  methods: ["stay"]
});

radar.before("bear:leave", function () {
  console.log("before:bear:leave listener called");
});

radar.after("bear:leave", function () {
  console.log("after:bear:leave listener called");
});
//
// radar.before("bear:stay", function () {
//   console.log(this.name + " is thinking about staying...");
// });
//
// radar.after("bear:stay", function () {
//   console.log(this.name + " stayed.");
// });
//
bear.leave(function () {
  console.log("original async callback");
});
// bear.stay();
