#!/usr/bin/env node
"use strict";

var _wrote = require("wrote");

var _fs = require("fs");

var _path = require("path");

var _argufy = _interopRequireDefault(require("argufy"));

var _usually = _interopRequireDefault(require("usually"));

var _spawncommand = _interopRequireDefault(require("spawncommand"));

var _ = _interopRequireDefault(require(".."));

var _extract2 = _interopRequireDefault(require("./extract"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  init: _init,
  from: _from = 'src',
  'out-dir': _to = 'build',
  _argv,
  extract: _extract,
  help: _help,
  install: _install
} = (0, _argufy.default)({
  init: {
    short: 'i',
    boolean: true
  },
  help: {
    short: 'h',
    boolean: true
  },
  from: {
    command: true
  },
  'out-dir': '-d',
  args: {
    short: 'a'
  },
  extract: {
    short: 'e'
  },
  install: {
    short: 'I',
    boolean: true
  }
});
const readable = (0, _path.resolve)(__dirname, '../rc.json');
const babelrc = (0, _path.resolve)(process.cwd(), '.babelrc');

async function init() {
  const rs = (0, _fs.createReadStream)(readable);
  const ws = await (0, _wrote.createWritable)(babelrc);
  await (0, _wrote.write)(ws, rs);
}
/*
bestie build [some/dir] [dest] [--copy-files] [--include-dotfiles] ...
bestie test
bestie watch
*/


const u = (0, _usually.default)({
  usage: {
    '--help, -h': 'print the help message',
    '--init, -i': 'write the .babelrc in the current directory'
  },
  line: 'bestie [src] [--out-dir build] [[--copy-files] --etc]',
  description: `A command-line tool to build packages.
  Source is the first argument, followed by any additional arguments
  Default source is src and default out-dir is build.
  Any other additional arguments are passed along to babel.
`,
  example: 'bestie src --out-dir build --copy-files'
});

if (_help) {
  console.log(u);
  process.exit();
}

const modules = ['@babel/cli', '@babel/core', '@babel/register', '@babel/plugin-syntax-object-rest-spread', '@babel/plugin-transform-modules-commonjs', 'babel-plugin-transform-rename-import'];

(async () => {
  if (_extract) {
    await (0, _extract2.default)(_extract);
    return;
  }

  try {
    if (_init) {
      await init();
      console.log('Written .babelrc file in the current directory');
      return;
    }

    if (_install) {
      const p = (0, _spawncommand.default)('yarn', ['add', '-DE', ...modules]);
      p.stderr.pipe(process.stderr);
      p.stdout.pipe(process.stdout);
      await p.promise;
      return;
    }

    await (0, _.default)({
      from: _from,
      to: _to,
      args: _argv
    });
  } catch (err) {
    console.log(err);
  }
})();