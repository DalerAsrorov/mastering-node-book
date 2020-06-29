## Understanding Asynchronous Event-Driven Programming

#### Node's Design

- Storing and retrieving data from physical device/disk takes much slower than moving data between solid-state devices such as microprocessors or memory chips, or L2/L3 caches.
- Node was designed to make I/O fast.
- Most worker threads spend their time waiting - for more instructions, subtasks to complete, etc. It utilizes collaborative work environment, where workers are regularly assigned new tasks to do.
  - One way to achieve this goal is to have a pool of available labors, improving efficiency by delegating tasks to different workers as the tasks come in.
  - One drawback: the amount of scheduling and worker surveillance that needs to be done. As a result, the role of dispatcher diminishes since it also has to do bookkeeping and keeping lists.
  - Solution to this - Queue
- Queue acts as a buffer between client and the dispatcher - new worker responsible for managing customer relations.
- Rather than proceeding task-by-task along a single timeline, multiple simultaneous jobs, on their own timelines, run in parallel.

<img src="./event-loop-diagram.png" height="400" style="margin: 0 auto" />

---

#### Understanding the Event Loop

- Important points to remember:
  - The event loop runs in the same thread as our JavaScript runs in. Blocking the event loop means blocking the entire thread.
  - The event loop starts as soon as the process starts and ends when no further callbacks remain to be performed. The event loop, consequently, may run forever
  - The event loop delegates many I/O operations to `libuv`, which manages these operations (using thread pools), notifying the event loop when results are available. An easy to reason about single-threaded programming model reinforced by efficiency of multi-threading.
- The key design choice made by Node designers was the implementation of an event loop as concurrency manager.
- Even though we wrote our code in JavaScript, we are actually deploying a very efficient multithreaded execution engine while avoiding the difficulties of OS asynchronous process management.

---

#### Phases and Priorities

- Different phases
  - Timers - callbacks deferred to some time in the future
  - I/O callbacks - prepared callbacks returned to the main thread
  - Poll/check - mainly the functions slotted on the stack according to the rules of `setImmediate` or `nextTick`
- Upon entering an event loop, Node, in effect, makes a copy of the current instruction queue (also known as **stack**), empties the original queue, and executes its copy. The processing of this instruction queue is referred to as a **tick**.

---

#### Signals

- Event-driven programming is like hardware interrupt programming. Interrupts do exactly what their name suggests - they use their ability to interrupt whatever a controller, or the CPU, or any other device is doing, demanding that their particular need is to be serviced immediately.
- For example, `SIGINT` is sent to a process when its controlling terminal detects _Ctrl + C_. Look for an example in in [sigint.js](./sigint.js)
- Sometimes we want to send a signal with one process from another one. This is called **Inter Process Communication**.

---

#### Child Processes

- A fundamental part of Node's design is to create or fork processes when parallelizing execution or scaling a system.
- Another powerful feature of sharing data between processes is to pass a network server an object to a child. (See examples in `net-parent.js` and `net-child.js`).

---

#### File Events

- Node allows developers to register for file events notifications using `fs.watch` method. It broadcasts changed events on files and directories.
- If the file does not exist, an **ENOENT** (no entity) error will be thrown, so using `fs.exists` at some prior useful point is encouraged.
- Run `node file-watch.js` to see the result of the new file creation, watching, and change.

---

#### Deferred Execution

- There are 2 types of deferred event sources that give a developer the ability to schedule callback executions to occur either before, or after, the processing of queued I/O events are `process.nextTick` and `setImmediate`.
- `process.nextTick`
  - Just like `setTimeout`, it delays execution of its callback function until some point in the future. However, the list of all `nextTick` callbacks are placed at the head of the event queue and is processed entirely and in order, before I/O or timer events and after execution of the current script.
  - The primary use of `nextTick` in a function is to postpone the broadcast of result events to listeners on the current execution stack until the caller has had an opportunity to register event listeners, giving a currently executing program a chance to bind callbacks to `EventEmitter.emit` events.
- `setImmediate`
  - This method is really more of a sibling to process.nextTick, differing in one very important way: while callbacks queued by nextTick will execute before I/O and timer events, callbacks queued by setImmediate will be called after I/O events.
  - Use `clearImmediate` to cancel (just like `clearTimeout` for `setTimeout`)

---

#### Timers

- used to schedule events in the future.
- JavaScript provides two asynchronous timers: `setInterval()` and `setTimeout()`.
- Unfortunately, as with `setTimeout`, this behavior is not always reliable. Importantly, if a system delay (such as some badly written blocking while loop) occupies the event loop for some period of time, intervals set prior and completing within that interim will have their results queued on the stack. When the event loop becomes unblocked and unwinds, all the interval callbacks will be fired in sequence, essentially immediately, losing any sort of timing delays they intended.

- `ref` and `unref` help developer control the ending of `setTimeout` if there is no more callbacks to execute.
  - The `unref` method allows the developer to assert the following instructions: when this timer is the only event source remaining for the event loop to process, go ahead and terminate the process.
