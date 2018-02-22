#!/usr/bin/env node
function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var _require = require("wrote/es5/src"),
    createWritable = _require.createWritable,
    write = _require.write;

var _require2 = require('fs'),
    createReadStream = _require2.createReadStream;

var _require3 = require('path'),
    resolve = _require3.resolve;

var bestie = require('..');

var defaultDestination = 'es5';
var defaultDir = '.';

var _process = process,
    _process$argv = _toArray(_process.argv),
    _process$argv$ = _process$argv[2],
    d = _process$argv$ === void 0 ? defaultDir : _process$argv$,
    _process$argv$2 = _process$argv[3],
    dest = _process$argv$2 === void 0 ? defaultDestination : _process$argv$2,
    args = _process$argv.slice(4);

var readable = resolve(__dirname, '../src/rc.json');
var babelrc = resolve(process.cwd(), '.babelrc');

function init() {
  return new Promise(function ($return, $error) {
    var rs, ws;
    rs = createReadStream(readable);
    return Promise.resolve(createWritable(babelrc)).then(function ($await_3) {
      try {
        ws = $await_3;
        return Promise.resolve(write(ws, rs)).then(function ($await_4) {
          try {
            return $return();
          } catch ($boundEx) {
            return $error($boundEx);
          }
        }.bind(this), $error);
      } catch ($boundEx) {
        return $error($boundEx);
      }
    }.bind(this), $error);
  }.bind(this));
}
/*

bestie build [some/dir] [dest] [--copy-files] [--include-dotfiles] ...
bestie test
bestie watch

*/


(function () {
  return new Promise(function ($return, $error) {
    var destination, dir;

    var $Try_1_Post = function () {
      try {
        return $return();
      } catch ($boundEx) {
        return $error($boundEx);
      }
    }.bind(this);

    var $Try_1_Catch = function (err) {
      try {
        console.log(err);
        return $Try_1_Post();
      } catch ($boundEx) {
        return $error($boundEx);
      }
    }.bind(this);

    try {
      if (d === 'init') {
        return Promise.resolve(init()).then(function ($await_5) {
          try {
            return $return();
          } catch ($boundEx) {
            return $Try_1_Catch($boundEx);
          }
        }.bind(this), $Try_1_Catch);
      }

      if (dest.startsWith('--')) {
        args.unshift(dest);
        destination = defaultDestination;
      } else {
        destination = dest;
      }

      if (d.startsWith('--')) {
        args.unshift(d);
        dir = defaultDir;
      } else {
        dir = d;
      }

      return Promise.resolve(bestie({
        dir,
        destination,
        args
      })).then(function ($await_6) {
        try {
          return $Try_1_Post();
        } catch ($boundEx) {
          return $Try_1_Catch($boundEx);
        }
      }.bind(this), $Try_1_Catch);
    } catch (err) {
      $Try_1_Catch(err)
    }
  }.bind(this));
})();