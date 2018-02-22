function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var spawncommand = require('spawncommand');

var _require = require('path'),
    resolve = _require.resolve,
    join = _require.join;

var _require2 = require("wrote/es5/src"),
    createWritable = _require2.createWritable,
    write = _require2.write,
    readJSON = _require2.readJSON,
    read = _require2.read;

var babelpath = require.resolve('@babel/cli/bin/babel.js');
/**
 * Invoke package's main function
 */


function bestie() {
  var $args = arguments;
  return new Promise(function ($return, $error) {
    var _ref, _ref$dir, dir, _ref$destination, destination, _ref$args, args, _ref$stdout, stdout, _ref$stderr, stderr, _ref$cwd, cwd, sources, destinations, jobs, i, _jobs$i, from, to, proc, _ref2, main, exports, path, ws;

    _ref = $args.length > 0 && $args[0] !== undefined ? $args[0] : {}, _ref$dir = _ref.dir, dir = _ref$dir === void 0 ? '.' : _ref$dir, _ref$destination = _ref.destination, destination = _ref$destination === void 0 ? 'es5' : _ref$destination, _ref$args = _ref.args, args = _ref$args === void 0 ? [] : _ref$args, _ref$stdout = _ref.stdout, stdout = _ref$stdout === void 0 ? process.stdout : _ref$stdout, _ref$stderr = _ref.stderr, stderr = _ref$stderr === void 0 ? process.stderr : _ref$stderr, _ref$cwd = _ref.cwd, cwd = _ref$cwd === void 0 ? process.cwd() : _ref$cwd;
    sources = dir === '.' ? ['src', 'test'] : dir.split(',');
    destinations = sources.map(function (source) {
      return join(destination, source);
    });
    jobs = sources.reduce(function (acc, from, i) {
      var to = destinations[i];
      return _toConsumableArray(acc).concat([{
        from,
        to
      }]);
    }, []);
    i = 0;
    var $Loop_1_trampoline;
    return ($Loop_1_trampoline = function (q) {
      while (q) {
        if (q.then) return void q.then($Loop_1_trampoline, $error);

        try {
          if (q.pop) {
            if (q.length) return q.pop() ? $Loop_1_exit.call(this) : q;else q = $Loop_1_step;
          } else q = q.call(this);
        } catch (_exception) {
          return $error(_exception);
        }
      }
    }.bind(this))($Loop_1);

    function $Loop_1() {
      if (i < jobs.length) {
        _jobs$i = jobs[i], from = _jobs$i.from, to = _jobs$i.to;
        proc = spawncommand(babelpath, [from, '--out-dir', to].concat(_toConsumableArray(args)), {
          cwd
        });
        console.log('\n', proc.spawnCommand, '\n');
        proc.stdout.pipe(stdout);
        proc.stderr.pipe(stderr);
        return Promise.resolve(proc.promise).then(function ($await_3) {
          try {
            return $Loop_1_step;
          } catch ($boundEx) {
            return $error($boundEx);
          }
        }.bind(this), $error);
      } else return [1];
    }

    function $Loop_1_step() {
      i++;
      return $Loop_1;
    }

    function $Loop_1_exit() {
      return Promise.resolve(readJSON('package.json')).then(function ($await_4) {
        try {
          _ref2 = $await_4, main = _ref2.main;
          return Promise.resolve(read(resolve(__dirname, 'exports.js'))).then(function ($await_5) {
            try {
              exports = $await_5.replace('$MAIN', main.replace(/\/index\.js$/, ''));
              path = join(destination, 'index.js');
              return Promise.resolve(createWritable(path)).then(function ($await_6) {
                try {
                  ws = $await_6;
                  return Promise.resolve(write(ws, exports)).then(function ($await_7) {
                    try {
                      console.log('%s now points to %s ', join(destination, 'index.js'), join(destination, main));
                      return $return();
                    } catch ($boundEx) {
                      return $error($boundEx);
                    }
                  }.bind(this), $error);
                } catch ($boundEx) {
                  return $error($boundEx);
                }
              }.bind(this), $error);
            } catch ($boundEx) {
              return $error($boundEx);
            }
          }.bind(this), $error);
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }
  }.bind(this));
}

module.exports = bestie;