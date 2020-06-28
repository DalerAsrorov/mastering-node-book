console.log("Running...");

// Keeps Node running the process
setInterval(() => {}, 2000);

// Subscribe to SIGINT, so some of our code runs
// when Node gets that signal
process.on("SIGINT", () => {
  console.log("We received the SIGINT signal!");
  process.exit(1);
});
