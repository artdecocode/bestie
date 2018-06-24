#!/usr/bin/env node
"use strict";

var _wrote = require("wrote");

var _fs = require("fs");

var _path = require("path");

var _argufy = _interopRequireDefault(require("argufy"));

var _usually = _interopRequireDefault(require("usually"));

var _spawncommand = _interopRequireDefault(require("spawncommand"));

var _reloquent = require("reloquent");

var _bosom = _interopRequireDefault(require("bosom"));

var _erte = require("erte");

var _ = _interopRequireDefault(require(".."));

var _extract2 = _interopRequireDefault(require("./extract"));

var _lib = require("../lib");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  init: _init,
  from: _from = 'src',
  'out-dir': _to = 'build',
  _argv,
  extract: _extract,
  help: _help,
  install: _install,
  uninstall: _uninstall
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
  'out-dir': 'd',
  args: {
    short: 'a'
  },
  extract: {
    short: 'e'
  },
  install: {
    short: 'I',
    boolean: true
  },
  uninstall: {
    short: 'U',
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
    '--help, -h': 'Print the help message.',
    '--init, -i': 'Write the .babelrc in the current directory.',
    '--install, -I': 'Add @babel dependencies.',
    '--uninstall, -U': 'Remove @babel dependencies from the current directory.'
  },
  line: 'bestie [src] [--out-dir build] [[--copy-files] --etc] | -iIU',
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

const readName = async () => {
  try {
    const {
      name
    } = await (0, _bosom.default)('package.json');
    return name;
  } catch (err) {
    throw new Error('Cannot read package.json on the current package');
  }
};

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
      const name = await readName();
      const [{
        devDependencies
      }] = (0, _lib.makeSSd)([{
        path: 'node_modules'
      }], '.');
      const i = (0, _lib.filterNotInstalled)(_lib.modules, devDependencies);

      if (!i.length) {
        console.log('Nothing to install for %s', name);
        return;
      }

      const p = (0, _spawncommand.default)('yarn', ['add', '-DE', ..._lib.modules]);
      p.stderr.pipe(process.stderr);
      p.stdout.pipe(process.stdout);
      await p.promise;
      return;
    }

    if (_uninstall) {
      const name = await readName();
      const [{
        devDependencies
      }] = (0, _lib.makeSSd)([{
        path: 'node_modules'
      }], '.');
      const i = (0, _lib.filterInstalled)(_lib.modules, devDependencies);
      const titles = i.map(j => `${j}@${devDependencies[j]}`);

      if (!i.length) {
        console.log('No @babel dependencies to remove for %s', name);
        return;
      }

      const y = await (0, _reloquent.askSingle)({
        text: `Continue removing\n ${titles.map(a => (0, _erte.c)(a, 'grey')).join('\n ')}\nfrom ${name}?`,
        defaultValue: 'y'
      });
      if (y != 'y') return;
      const args = ['remove', ...i];
      const p = (0, _spawncommand.default)('yarn', args);
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