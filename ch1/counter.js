const EventEmitter = require("events").EventEmitter;

const Counter = function (i) {
  this.increment = function () {
    // increment the count the Counter instance holds
    i++;
    // emit an event named 'incremented'
    this.emit("incremented", i);
  };
  this.decrement = function () {
    i--;
    this.emit("decremented", i);
  };
};

// base our Counter on Node's EventEmitter
Counter.prototype = new EventEmitter();
// create an instance of Counter
const counter = new Counter(10);

const callback = function (n) {
  console.log(n);
};

counter.addListener("incremented", callback);
counter.addListener("decremented", callback);
counter.increment(); // 11
counter.increment(); // 12
counter.decrement(); // 11
counter.decrement(); // 10
counter.decrement(); // 9
