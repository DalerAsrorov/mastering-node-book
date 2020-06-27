## Understanding the Node Environment

- Google released Chrome in 2008 and Ryan Dah wrote NodeJS in 2009
- NodeJS imagines JavaScript as a systems language, like C. It can manipulate memory buffers, processes and streams, and files and sockets. Due to performance of the V8 engine.
- V8 is an engine that provides the runtime environment in which JavaScript executes. JavaScript engine is independent of the browser in which it's hosted. This key feature enabled the rise of Node.
- _Write programs to handle text streams, because that is a universal interface_ - Peter Salus, A Quarter-Century of Unix 1994
- Ryan Dahl used this principle while building NodeJS:
  - Node's design favors simplicity over complexity
  - Node uses familiar _POSIX APIs_ rather than attempting an improvement.
  - Node does everything with events and doesn't need threads.
    Node leverages the existing C libraries, rather than trying to reimplement their functionality.
  - Node favors text over binary formats.

---

- **POSIX** - Portable Operating System Interfaces, defines the standard APIs for Unix and is adopted in Unix-based OSs and beyond.

**C:**

```C
int mkdir(const char *path, mode_t mode);
```

**Node:**

```javascript
fs.mkdir(path[, mode], callback)
```

- To handle asynchronous tasks in a computer, the accepted tool to solve this problem is the _thread_
- In Node there is one thread bound to an event loop. Deferred tasks are encapsulated, entering and exiting the execution context via callback.
- I/O operations generate event data streams, and these streams are piped through a single stack. Concurrency is managed by the system, abstracting thread pools and simplifying shared access to memory.

---

- Node is built on standard open source C libraries, like _TLS_ and _SSL_ protocols are implemented by _OpenSSL_. C source code is included and compiled into Node. For example, when your JS program hashes a cryptographic key, it's not JS that's actually doing the work - your JS, run by Node, has called down to the C code of OpenSSL.
- Essentially, you are scripting the native library (or abstracting it).

---

- Guided by the Unix philosophy, Ryan Dahl was guided by a few rigid principles:
  - A Node program/process runs on a single thread, ordering execution through an event loop.
  - Web applications are I/O intensive, so the focus should be on making I/O fast.
  - Program flow is always directed through asynchronous callbacks.
  - **Expensive CPU operations should be split off into separate parallel processes, emitting events as results later.**
  - Complex programs should be assembled from simpler programs.
- _The general principle is, operations must never block._ Node's desire for speed (high concurrency) and efficiency (minimal resource usage) demands the reduction of waste. A waiting process is a wasteful process, especially when waiting for I/O.

---

- Many functions in the Node API emit events. These events are instances of `events.EventEmitter`. Any object can extend `EventEmitter` for a simple and uniform creation of asynchronous interfaces to object methods.
- [An example](./counter.js) of how `EventEmitter` object, which can be easily extended, is set as the prototype of a function constructor.Then, each constructed instance haas the `EventEmitter` object exposed to its prototype chain, providing a natural reference to the event API.
- Node can handle I/O data [streams](./stream.js) in an event oriented manner, performing long-running tasks while keeping true to Node's principles of asynchronous, non-blocking programming.
