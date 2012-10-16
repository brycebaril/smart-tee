#!/usr/bin/env node

var nconf = require("nconf");
var fs = require("fs");

// Usage: smart-tee.js config.json OPTION=...
// OPTIONS can be defined in ARGV, ENV, specified config.json

// Hierarchy: ARGV > ENV > Specified config file > defaults
nconf.argv().env();
if (process.argv[2] && process.argv[2].match(/\.json$/i)) {
  nconf.add("local", {type: "file", file: process.argv[2]})
}

// No default streams, if "echo" is true, simplest stream will pipe everything to stdout.
var echo = {stream: process.stdout};

// Require any specified stream definitions

// output stream providers
var stream_providers = [];
nconf.get("PROVIDERS").forEach(function (script) {
  var exists = fs.existsSync(script);
  if (!exists) {
    console.error("Unable to find provider %s", script);
    return;
  }
  var provider = require(script).create(nconf);
  stream_providers.push(provider);
  provider.on("repipe", repipe);
});

if (nconf.get("echo")) {
  stream_providers.push(echo);
}

// if no output streams, print usage and exit
if (!stream_providers.length) {
  console.log("TODO Usage...");
  process.exit(1);
}

repipe();

function repipe() {
  process.stdin.pause();
  process.stdin.removeAllListeners();
  if (process.stdin.readable) {
    process.stdin.on("end", done);
    // pause, pipeline all output streams, resume(?)
    stream_providers.forEach(function (provider) {
      process.stdin.pipe(provider.stream);
    });
    process.stdin.resume();
  }
}

function done() {
  stream_providers.forEach(function (provider) {
    provider.done();
  });
}
