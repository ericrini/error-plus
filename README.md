# ErrorPlus
Have you ever gotten an error like ECONNREFUSED and thought "gee this application makes 3 or 4 connections, this error
doesn't really tell me what is failing." ErrorPlus is an attempt to provide the syntactical sugar needed to properly
capture and format errors spanning across complex asynchronous workflows. This should result in making it easy to build
up detailed errors as they propagate back up the call stack from deep in the bowels of the V8 system libraries.

# Trivial Example

```javascript
var ErrorPlus = module.require('./ErrorPlus');

var error1 = new ErrorPlus('IllegalOperation', 'Permission denied.');
var error2 = new ErrorPlus(error1, 'FileNotFound', 'Could not open the file "%s".', '/tmp/logs/process-20000101000000.log');
var error3 = new ErrorPlus(error2, 'InternalFailure', 'Unable to write log entry.');

console.log(error3.format());
```

The format function produces a very readable string that could easily be included in a single error log entry.

```
InternalFailure: Unable to write log entry.
    at Object.<anonymous> (C:\Users\Eric\WebstormProjects\nostradamus\datalayer\source\ErrorPlus-spec.js:5:14)
    at Module._compile (module.js:460:26)
    at Object.Module._extensions..js (module.js:478:10)
    at Module.load (module.js:355:32)
    at Function.Module._load (module.js:310:12)
    at Function.Module.runMain (module.js:501:10)
    at startup (node.js:129:16)
    at node.js:814:3
FileNotFound: Could not open the file "/tmp/logs/process-20000101000000.log".
    at Object.<anonymous> (C:\Users\Eric\WebstormProjects\nostradamus\datalayer\source\ErrorPlus-spec.js:4:14)
    at Module._compile (module.js:460:26)
    at Object.Module._extensions..js (module.js:478:10)
    at Module.load (module.js:355:32)
    at Function.Module._load (module.js:310:12)
    at Function.Module.runMain (module.js:501:10)
    at startup (node.js:129:16)
    at node.js:814:3
IllegalOperation: Permission denied.
    at Object.<anonymous> (C:\Users\Eric\WebstormProjects\nostradamus\datalayer\source\ErrorPlus-spec.js:3:14)
    at Module._compile (module.js:460:26)
    at Object.Module._extensions..js (module.js:478:10)
    at Module.load (module.js:355:32)
    at Function.Module._load (module.js:310:12)
    at Function.Module.runMain (module.js:501:10)
    at startup (node.js:129:16)
    at node.js:814:3
```

# Async Example

In a real async workflow, each stack trace would potentially be from a different call stack. If you are careful to
enhance the error before you callback with it, you can get a much better top down view of what happened. Towards the top
of the stack should be your application's messages and towards the bottom will be frustrating V8 system errors like
ENOENT and ECONNREFUSED.

```javascript
somethingAsync(function (error) {
    if (error) {

        // Rather than just propagating the error, we enhance it, adding more and more detail.
        callback(new ErrorPlus(error, 'EnhancedType', 'Enhanced error message about what is happening here.'););
    }
})
```

Enjoy!

```
The MIT License (MIT)

Copyright (c) 2015 Eric Rini

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
