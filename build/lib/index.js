"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.singleBuild = singleBuild;
exports.filterNotInstalled = exports.filterInstalled = exports.makeSSd = exports.modules = void 0;

var _spawncommand = _interopRequireDefault(require("spawncommand"));

var _path = require("path");

var _util = require("util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LOG = (0, _util.debuglog)('bestie');

async function singleBuild(from, to, args, {
  cwd = process.cwd(),
  stdout,
  stderr
}) {
  const babelpath = (0, _path.relative)(cwd, require.resolve('@babel/cli/bin/babel.js'));
  const proc = (0, _spawncommand.default)(babelpath, [from, '--out-dir', to, ...args], {
    cwd
  });
  console.log('\n', proc.spawnCommand, '\n');
  proc.stdout.pipe(stdout);
  proc.stderr.pipe(stderr);
  await proc.promise;
}

const modules = ['@babel/cli', '@babel/core', '@babel/register', '@babel/plugin-syntax-object-rest-spread', '@babel/plugin-transform-modules-commonjs', 'babel-plugin-transform-rename-import'];
exports.modules = modules;

const makeSSd = (sd, dir) => {
  const ssd = sd.map(({
    path,
    ...pckg
  }) => {
    // path to node modules
    const packagePath = (0, _path.resolve)(dir, path, '..');
    const rel = (0, _path.relative)(dir, packagePath);
    if (rel == 'bestie') return undefined;
    const pc = (0, _path.resolve)(packagePath, 'package.json');

    const {
      devDependencies
    } = require(pc);

    return {
      rel,
      devDependencies,
      packagePath,
      path,
      ...pckg
    };
  });
  return ssd;
};

exports.makeSSd = makeSSd;

const filterInstalled = (mods, devDependencies, rel = 'unknown') => {
  const d = Object.keys(devDependencies);
  return mods.filter(m => {
    const i = d.some(key => key == m);
    if (!i) LOG('%s not installed for %s', m, rel);
    return i;
  });
};

exports.filterInstalled = filterInstalled;

const filterNotInstalled = (mods, devDependencies) => {
  const d = Object.keys(devDependencies);
  return mods.filter(m => {
    const i = d.some(key => key == m);
    return !i;
  });
};

exports.filterNotInstalled = filterNotInstalled;