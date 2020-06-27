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
- Let's write a a simple client and server programs. Run:

```bash
cd ch1
node network-udp-server.js # in one terminal
node network-udp-cleint.js # in another terminal
```

- A UDP server is an instance of `EventEmitter`, emitting a message event when messages are received on the bound port.

---

#### V8, JavaScript, and Optimizations

- V8 is a Google's JavaScript engine, written in C++. It manages Node's main process thread.
- When executing JavaScript, V8 does so in its own process and its internal behavior is not controlled by Node.
- V8 compiles JavaScript into native machine code, rather than interpreting bytecode, or using just-in-time techniques.
  1. A first-pass compiler (the _full_ compiler) converts your code into a runnable state as quickly as possible. During this step, type analysis and other detailed analysis of the code is deferred, prioritizing fast compilation - your JavaScript can begin executing as close to instantly as possible. Further optimizations are accomplished during the second step.
  1. Once the program is up and running, an optimizing compiler then begins its job of watching how your program runs, and attempting to determine its current and future runtime characteristics, optimizing and re-optimizing as necessary. For example, if a certain function is being called many thousands of times with similar arguments of a consistent type, V8 will re-compile the function with code optimized on the optimistic assumption that future types will be like the past types. While the first compile step was conservative with as-yet unknown and un-typed functional signature, this `hot` function's predictable texture impels V8 to assume a certain optimal profile and re-compile based on that assumption.
- JavaScript only has `Number` type defined as a double-precision floating-point number.
- V8 uses 32-bit numbers for all values internally. One bit is used to point to another 32-bit number if greater width is needed.
- Optimization code can be run with native V8 commands.

```bash
cd ch1
node --allow-natives-syntax --trace_opt --trace_deopt square-optimized.js
```

outputs:

```bash
[manually marking 0x322430ee6669 <JSFunction square (sfi = 0x322457a50909)> for non-concurrent optimization]
[compiling method 0x322430ee6669 <JSFunction square (sfi = 0x322457a50909)> using TurboFan]
[optimizing 0x322430ee6669 <JSFunction square (sfi = 0x322457a50909)> - took 0.644, 0.229, 0.008 ms]
 ~/mastering-node-book/ch1   master ●  node --allow-natives-syntax --trace_opt --trace_deopt square-optimized.js
```

If you add the following, however:

```js
%OptimizeFunctionOnNextCall(square);
operand = 3.01;
square();
```

The output is:

```bash
[manually marking 0x243c3566aac9 <JSFunction square (sfi = 0x243c43c4d961)> for non-concurrent optimization]
[compiling method 0x243c3566aac9 <JSFunction square (sfi = 0x243c43c4d961)> using TurboFan]
[optimizing 0x243c3566aac9 <JSFunction square (sfi = 0x243c43c4d961)> - took 0.724, 0.374, 0.013 ms]
[deoptimizing (DEOPT eager): begin 0x243c3566aac9 <JSFunction square (sfi = 0x243c43c4d961)> (opt #0) @0, FP to SP delta: 24, caller sp: 0x7ffeefbfdbb8]
            ;;; deoptimize at </Users/dalerasrorov/mastering-node-book/ch1/square-optimized.js:4:18>, not a Smi
  reading input frame square => bytecode_offset=0, args=1, height=2; inputs:
      0: 0x243c3566aac9 ; [fp - 16] 0x243c3566aac9 <JSFunction square (sfi = 0x243c43c4d961)>
      1: 0x243c0fa9ccf9 ; [fp + 16] 0x243c0fa9ccf9 <JSGlobal Object>
      2: 0x243c3566aa91 ; [fp - 8] 0x243c3566aa91 <FixedArray[5]>
      3: 0x243c5ee02579 ; (literal 1) 0x243c5ee02579 <Odd Oddball: optimized_out>
      4: 0x243c5ee02579 ; (literal 1) 0x243c5ee02579 <Odd Oddball: optimized_out>
  translating interpreted frame square => bytecode_offset=0, height=16
    0x7ffeefbfdbb0: [top + 64] <- 0x243c0fa9ccf9 ;  0x243c0fa9ccf9 <JSGlobal Object>  (input #1)
    -------------------------
    0x7ffeefbfdba8: [top + 56] <- 0x334af41144f7 ;  caller's pc
    0x7ffeefbfdba0: [top + 48] <- 0x7ffeefbfdbe8 ;  caller's fp
    0x7ffeefbfdb98: [top + 40] <- 0x243c3566aa91 ;  context    0x243c3566aa91 <FixedArray[5]>  (input #2)
    0x7ffeefbfdb90: [top + 32] <- 0x243c3566aac9 ;  function    0x243c3566aac9 <JSFunction square (sfi = 0x243c43c4d961)>  (input #0)
    0x7ffeefbfdb88: [top + 24] <- 0x243c43c4e869 ;  bytecode array 0x243c43c4e869 <BytecodeArray[15]>  (input #0)
    0x7ffeefbfdb80: [top + 16] <- 0x3900000000 ;  bytecode offset @ 0
  (input #0)
    -------------------------
    0x7ffeefbfdb78: [top + 8] <- 0x243c5ee02579 ;  0x243c5ee02579 <Odd Oddball: optimized_out>  (input #3)
    0x7ffeefbfdb70: [top + 0] <- 0x243c5ee02579 ;  accumulator 0x243c5ee02579 <Odd Oddball: optimized_out>  (input #4)
[deoptimizing (eager): end 0x243c3566aac9 <JSFunction square (sfi = 0x243c43c4d961)> @0 => node=0, pc=0x334af4114d20, caller sp=0x7ffeefbfdbb8, took 0.660 ms]
```

- A very expressive optimization report shows that the once-optimized square function was de-optimized following the change we made in one number's type.
- **The code works best when it's predictable**
- Avoid mixing types in arrays - it's always better to have consistent data type. V8 creates _blueprints_ of objects by creating hidden classes to track types and when those types change the optimization, blueprints will be destroyed and rebuilt (if you're lucky).
- Do not every use `delete` to remove elements from an array - you are simply inserting an undefined value at that position.
- Try not to preallocate large arrays - grow as you go
- With objects as with arrays try to define as much as possible the shape of your data structures in a _future-proof_ manner.
- Avoid _polymorphic_ functions. Functions that accept variable function arguments will be de-optimized.

---

#### The process object

-
