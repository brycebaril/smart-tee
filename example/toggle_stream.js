module.exports = ToggleStream

var Transform = require("stream").Transform

if (!Transform) {
  Transform = require("readable-stream/transform")
}

var fs = require("fs")
var util = require("util")

function ToggleStream(config) {
  if (!(this instanceof ToggleStream)) return new ToggleStream(config)
  Transform.call(this)

  this.sinks = [process.stdout, process.stderr]
  this.toggle()
}
util.inherits(ToggleStream, Transform)

// Not the best idea in reality -- this can't keep up with a really fast source.
ToggleStream.prototype.toggle = function () {
  this.unpipe()
  var next = this.sinks.shift()
  this.sinks.push(next)
  this.pipe(next)
}

ToggleStream.prototype._transform = function (chunk, encoding, cb) {
  this.push(chunk)
  this.toggle()
  cb()
}
