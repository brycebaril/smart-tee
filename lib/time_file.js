var fs = require("fs");
var mkdir = require("mkdirp");
var events = require("events");
var util = require("util");
var zlib = require("zlib");

// interval_ms chosen to balance cost w/ reasonable assurance of logging to the right file
var DATE_OPTIONS = {
  year: {key: "%Y", interval_ms: 60*1000, get: function(date) { return date.toISOString().substr(0,4)}},
  month: {key: "%m", interval_ms: 60*1000, get: function(date) { return date.toISOString().substr(5,2) }},
  day: {key: "%d", interval_ms: 60*1000, get: function (date) { return date.toISOString().substr(8,2) }},
  iso_date: {key: "%x", interval_ms: 60*1000, get: function (date) { return date.toISOString().substr(0,10) }},
  hour: {key: "%h", interval_ms: 1000, get: function (date) { return date.toISOString().substr(11,2); }},
  minute: {key: "%M", interval_ms: 500, get: function (date) { return date.toISOString().substr(14,2); }},
  second: {key: "%S", interval_ms: 50, get: function (date) { return date.toISOString().substr(17,2); }},
  iso_time: {key: "%X", interval_ms: 50, get: function (date) { return date.toISOString().substr(11,8); }},
  iso: {key: "%I", interval_ms: 50, get: function (date) { return date.toISOString().substr(0,19); }},
};

// Date
// %Y 4-digit year
// %m month (01..12)
// %d day of month (01..31)
// %x iso8601 date portion (e.g. 2012-09-24)
// Time
// %h hour (00..23)
// %M minute (00..59)
// %S second (00..61)
// %X iso8601 time portion to the second (e.g.: 15:12:47)
// %I iso8601 date/time to the second (e.g. 2012-09-24T15:12:47)

// NOTE: date/time substitutions only work on "path" not "symlink" paths.

// TODO contribue to usage

function TimeFile(config) {
  events.EventEmitter.call(this);
  // TBD should check for bad filenames somewhere
  this.symlink = config.get("symlink") || "";
  this.path_config = config.get("path") || "out.log";
  this.compress = config.get("compress") || false;

  process.on("SIGHUP", function () {this.renew(true)});

  this.path_options = {};
  this.interval_ms = Number.MAX_VALUE;
  Object.keys(DATE_OPTIONS).forEach((function (option) {
    if (this.path_config.match(new RegExp(DATE_OPTIONS[option].key))) {
      this.path_options[option] = true;
      if (DATE_OPTIONS[option].interval_ms < this.interval_ms) {
        this.interval_ms = DATE_OPTIONS[option].interval_ms;
      }
    }
  }).bind(this));

  // if rotating by the second, what? -- how fast is too fast?
  // TODO make sure messages don't get lost

  this.renew(true);
  if (this.interval_ms < Number.MAX_VALUE) {
    this.interval = setInterval((function () { this.renew() }).bind(this), this.interval_ms);
  }
}
util.inherits(TimeFile, events.EventEmitter);

TimeFile.prototype.renew = function (force) {
  var current_name = this.current_name();
  if (force || current_name !== this.path) {
    var old_path = this.path;
    this.path = current_name;
    var old_stream = this.stream;
    mkpath(this.path);
    this.stream = fs.createWriteStream(this.path, {flags: "a", encoding: "utf8"});
    if (this.symlink) {
      mkpath(this.symlink);
      fs.unlink(this.symlink, (function () { fs.symlink(this.path, this.symlink) }).bind(this));
    }
    this.emit("repipe");
    if (old_stream && this.compress) {
      old_stream.on("close", function () {
        archive(old_path);
      });
    }
    if (old_stream && old_stream.writable) old_stream.destroySoon();
  }
}

function mkpath(path) {
  if (path.match(/\//)) {
    var path_array = path.split("/");
    mkdir.sync(path_array.splice(0,path_array.length-1).join("/"));
  }
}

function archive(path) {
  var inp = fs.createReadStream(path);
  var out = fs.createWriteStream(path + ".gz");
  inp.on("end", function () {
    fs.unlink(path);
  });
  inp.pipe(zlib.createGzip()).pipe(out);
}

TimeFile.prototype.current_name = function () {
  var d = new Date();
  var path = this.path_config;
  if (Object.keys(this.path_options).length) {
    Object.keys(this.path_options).forEach(function (option) {
      path = path.replace(DATE_OPTIONS[option].key, DATE_OPTIONS[option].get(d));
    });
    return path;
  }
  else {
    return this.path_config;
  }
}

TimeFile.prototype.done = function () {
  clearInterval(this.interval);
}

function create(config) {
  return new TimeFile(config);
}
exports.create = create;
