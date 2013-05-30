# smart-tee

==Note!==
This package currently does not yet work with 0.10.x+ I'll be releasing an update soon.

A node.js "smart" work-alike to the unix "tee" command. Takes stdin and pipes it to any arbitrary streams you configure.

For example, let's say you wanted to run your program and pipe the output to all of {console, rotated log files, POST to your tsdb}. This lets you do that via:

```bash
$ node app.js 2>&1 | smart-tee config.json
```

# included streams

* Echo: echo stdin back to stdout
* Time-File: Automatically save stdin to log files, and rotate them based on a config. Inspired by cronolog.

# custom streams

* Creating a custom stream is easy -- it must provide an object with the following:
  * Contain a Writable Stream object as it's "stream" attribute.
  * Implements EventEmitter and may emit a "repipe" event to force all streams to allow it to reset the input stream.
  * Implements a done() function for any required cleanup.

See the time_file.js stream provider for a complete example.

# configuration

Configuration uses the flatiron/nconf library. You can invoke it with a json file as the first argument containing your configuration, or specify flags on the command-line or ENV. Each loaded provider can look for its own configuration values. It listens two two by default:

* PROVIDERS -- a list of stream providers to use, generally specify the full path to the provider's .js file.
* echo -- echo stdin back to stdout. Useful for running on the console but still using the logic from your other streams

# usage

TODO

# TODO

* Tests
* More work
  * usage
  * allow usage to write usage based on loaded providers
  * prepare for new streams2 work
* Documentation
* More streams

# license

(The MIT License)

Copyright (c) Bryce B. Baril <bryce@ravenwall.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
