# Node Module System

* [Introduction](introduction.md) - What this topic covers: why modules exist, the core modules, and writing your own.
* [The global object](global-object.md) - The globals JavaScript and Node.js provide, and why a variable declared in a file isn't one of them.
* [Modules](modules.md) - Why every file is wrapped in its own module, and what the `module` object itself contains.
* [Module wrapper function](module-wrapper-function.md) - The hidden function Node injects around each CommonJS file, including `exports`, `require`, `module`, `__filename`, and `__dirname`.
* [Creating a module](creating-a-module.md) - Writing a real module file and choosing what to expose from it with `module.exports`.
* [Loading a module](loading-a-module.md) - Pulling `logger.js` into `app.js` with `require()`, calling its exported function, and why `const` beats `var` for the result.
