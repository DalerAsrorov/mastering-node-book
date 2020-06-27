const Readable = require('stream').Readable
const r = new Readable()

let count = 0

r._read = function () {
  count++
  if (count > 10) {
    // push null downstream to signal we've got no more data
    return r.push(null)
  }
  setTimeout(() => {
    // every half a second from now, push our count on a line
    r.push(count + '\n')
  }, 500)
}

// have our readable send the data it produces to stanrard out
r.pipe(process.stdout)
