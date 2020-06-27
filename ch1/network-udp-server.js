const dgram = require("dgram");
const server = dgram.createSocket("udp4");
const PORT = 41234;

server
  .on("message", (msg) => {
    process.stdout.write(`Got message: ${msg}\n`);
    process.exit();
  })
  .on("listening", () => {
    const address = server.address();
    console.log(`Server listening ${address.address}:${address.port}`);
  })
  .bind(PORT);
