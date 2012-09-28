# smart-tee

A node.js "smart" work-alike to the unix "tee" command. Takes stdin and pipes it to any arbitrary streams you configure.

For example, let's say you wanted to run your program and pipe the output to all of {console, rotated log files, POST to your tsdb}. This lets you do that via:

```bash
$ node app.js 2>&1 | smart-tee config.json
```

# included streams

* Echo: echo stdin back to stdout
* Time-File: Automatically save stdin to log files, and rotate them based on a config. Inspired by cronolog.

# custom streams

TODO

# configuration

TODO

# usage

TODO

# license

(The MIT License)

Copyright (c) Bryce B. Baril <bryce@ravenwall.com> 

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
