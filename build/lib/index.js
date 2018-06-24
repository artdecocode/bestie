"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.singleBuild = singleBuild;
exports.modules = void 0;

var _spawncommand = _interopRequireDefault(require("spawncommand"));

var _path = require("path");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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