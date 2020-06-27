const dgram = require("dgram");
const { argv } = require("process");
const client = dgram.createSocket("udp4");
const PORT = 41234;

let message = process.argv.length >= 1 ? process.argv.splice(2).join(" ") || "message" : "message";
message = Buffer.from(message);

client.send(message, 0, message.length, PORT, "localhost", () => {
  process.exit();
});
