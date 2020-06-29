const events = require("events");

const getEmitter = () => {
  const emitter = new events.EventEmitter();
  emitter.emit("start");

  // The following solves the race condition problem:
  process.nextTick(() => {
    emitter.emit("start");
  });

  return emitter;
};

const myEmitter = getEmitter();
myEmitter.on("start", () => {
  console.log("Started");
});
