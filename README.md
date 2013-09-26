smart-tee
=========

[![NPM](https://nodei.co/npm/smart-tee.png)](https://nodei.co/npm/smart-tee/)

[![david-dm](https://david-dm.org/brycebaril/smart-tee.png)](https://david-dm.org/brycebaril/smart-tee/)
[![david-dm](https://david-dm.org/brycebaril/smart-tee/dev-status.png)](https://david-dm.org/brycebaril/smart-tee#info=devDependencies/)

A node.js "smart" work-alike to the unix "tee" command. Takes stdin and pipes it to any arbitrary streams you configure.

For example, let's say you wanted to run your program and pipe the output to all of {console, rotated log files, POST to your tsdb}. This lets you do that via:

```bash
$ node app.js 2>&1 | smart-tee --s my_cool_tsdb --s stream-file-archive --s stdout --path logs/app-%Y-%m-%d.log --compress true
```

custom streams
--------------

Plays well with others! For custom streams, it expects them to be writable, and that they export a function that takes a config object and returns the writable stream. See [stream-file-archive](http://npm.im/stream-file-archive) or the [examples](https://github.com/brycebaril/smart-tee/tree/master/example) folder.

configuration
-------------

Configuration is done on the command-line. Try not to use conflicting option names. (e.g. path)

Built-in options
----------------

  * `-s stream-module` the name or path of a stream module to require & pipe to
  * `-s stdout` pipe back to stdout
  * `-s stderr` pipe back to stderr

LICENSE
=======

(The MIT License)

Copyright (c) Bryce B. Baril <bryce@ravenwall.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
