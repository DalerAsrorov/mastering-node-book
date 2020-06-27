## Understanding the Node Environment

#### JS as a systems language

- Google released Chrome in 2008 and Ryan Dahl wrote NodeJS in 2009
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

#### POSIX

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

#### Standard Libraries

- Node is built on standard open source C libraries, like _TLS_ and _SSL_ protocols are implemented by _OpenSSL_. C source code is included and compiled into Node. For example, when your JS program hashes a cryptographic key, it's not JS that's actually doing the work - your JS, run by Node, has called down to the C code of OpenSSL.
- Essentially, you are scripting the native library (or abstracting it).

---

#### Extending JavaScript

- Guided by the Unix philosophy, Ryan Dahl was guided by a few rigid principles:
  - A Node program/process runs on a single thread, ordering execution through an event loop.
  - Web applications are I/O intensive, so the focus should be on making I/O fast.
  - Program flow is always directed through asynchronous callbacks.
  - **Expensive CPU operations should be split off into separate parallel processes, emitting events as results later.**
  - Complex programs should be assembled from simpler programs.
- _The general principle is, operations must never block._ Node's desire for speed (high concurrency) and efficiency (minimal resource usage) demands the reduction of waste. A waiting process is a wasteful process, especially when waiting for I/O.

---

#### Events

- Many functions in the Node API emit events. These events are instances of `events.EventEmitter`. Any object can extend `EventEmitter` for a simple and uniform creation of asynchronous interfaces to object methods.
- [An example](./counter.js) of how `EventEmitter` object, which can be easily extended, is set as the prototype of a function constructor.Then, each constructed instance haas the `EventEmitter` object exposed to its prototype chain, providing a natural reference to the event API.
- Node can handle I/O data [streams](./stream.js) in an event oriented manner, performing long-running tasks while keeping true to Node's principles of asynchronous, non-blocking programming.
- Node consistently implements I/O operations as asynchronous, evented data streams. This design choice enables Node's excellent performance. Instead of creating a thread (or spinning up an entire process) for a long-running task like a file upload that stream may represent, Node only needs to commit the resources to handle callbacks. Also, in the long stretches of time in between the short moments when the stream is pushing data, Node's event loop is free to process other instructions.
- Exercise: re-implement `stream.js` to send the data `r` produces to a file instead of a terminal ([`stream-writable.js`](./stream-writable.js))

---

#### Modularity

- JavaScript needed a standard way to load and share discreet program modules and found one in 2008 with the _CommonJS Modules specification_. Node follows this specification, making it easy to define and share bits of reusable code called **modules** and **packages**.
- Package - a directory of JavaScript files.
- The `package.json` file defines a list of packages needed to run Node application.
- Uses _Semantic Versioning (SemVer)_ rules with a pattern like `Major.Minor.Patch`.
  - _Major_ - change in the purpose or outcome of the API. May break or produce unintended result.
  - _Minor_ - the package has added functionality but remains compatible. New or more advanced parts of the API could be seen in docs.
  - _Patch_ - the package fixed a bug, improved performance, or refactored a little.
- _CommonJS_ gave JavaScript packages. This lead to requirement of a package manager (`npm`).
  - the efforts of thousands of other developers can be linked into applications via `npm`.

---

#### The network

- node supports standard network protocols in addition to HTTP, such as TLS/SSL, and UDP. These tools allow us to build scalable network programs.
- Let's write a [simple program](./network-udp.js)
