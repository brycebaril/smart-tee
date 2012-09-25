var nconf = require("nconf");

// Usage: smart-tee.js config.json OPTION=...
// OPTIONS can be defined in ARGV, ENV, specified config.json
// Default values are stored in defaults.json

// Hierarchy: ARGV > ENV > Specified config file > defaults
nconf.argv().env();
if (process.argv[2] && process.argv[2].match(/\.json$/i)) {
  console.log(process.argv[2]);
  nconf.add("local", {type: "file", file: process.argv[2]})
}

// No default streams, if "echo" is true, simplest stream will pipe everything to stdout.
var echo = {stream: process.stdout};

// Require any specified stream definitions

// output stream providers
var stream_providers = [];
if (nconf.get("echo")) {
  stream_providers.push(echo);
}
var time_file = require("../lib/time_file.js").createTimeFile(nconf);
stream_providers.push(time_file);
time_file.on("repipe", repipe);

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
    process.stdin.on("end", function () {
      process.exit();
    });
    // pause, pipeline all output streams, resume(?)
    stream_providers.forEach(function (provider) {
      process.stdin.pipe(provider.stream);
    });
    process.stdin.resume();
  }
}
