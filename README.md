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
