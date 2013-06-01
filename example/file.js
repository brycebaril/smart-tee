module.exports = FileStream

var fs = require("fs")

function FileStream(config) {
  var path = config.path || "out.log"
  this.stream = fs.createWriteStream(path, {flags: "a", encoding: "utf8"})

  return this.stream
}
