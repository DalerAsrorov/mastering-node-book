setInterval(() => {}, 1e6);
process.on("SIGINT", () => {
  console.log("Got signal!");
});
