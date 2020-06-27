const fs = require('fs')
const Readable = require('stream').Readable

const r = new Readable()
const w = fs.createWriteStream('./counter.txt', { flags: 'w', mode: 0666 })
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

r.pipe(w)
