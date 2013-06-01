#!/usr/bin/env node

var argv = require("optimist").argv
var path = require("path")

// Usage: smart-tee.js config.json --s stream --s stream --option blah...

var simpleStreams = {
  stdout: process.stdout,
  stderr: process.stderr,
}

// output streams
var streamModules = argv.s
if (!streamModules) streamModules = []
if (!Array.isArray(streamModules)) streamModules = [streamModules]

var outStreams = []
if (!streamModules.length) {
  console.error("No ouptut stream specified, defaulting to stdout.")
  streamModules.push("stdout")
}

streamModules.forEach(function (module) {
  if (simpleStreams[module]) {
    outStreams.push(simpleStreams[module])
  }
  else {
    var mod
    try {
      mod = require(module)
    }
    catch (e) {
      if (!/Cannot find module/.exec(e)) throw e
      if (/^(?:\/|\.)/.exec(module)) throw e
      mod = require(path.join(process.cwd(), module))
    }
    outStreams.push(mod(argv))
  }
})

start()

function start() {
  if (process.stdin.readable) {
    outStreams.forEach(function (stream) {
      process.stdin.pipe(stream)
    })
  }
}
