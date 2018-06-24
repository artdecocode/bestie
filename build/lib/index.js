"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _spawncommand = _interopRequireDefault(require("spawncommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const babelpath = require.resolve('@babel/cli/bin/babel.js');

async function singleBuild(from, to, args, {
  cwd = process.cwd(),
  stdout,
  stderr
}) {
  const proc = (0, _spawncommand.default)(babelpath, [from, '--out-dir', to, ...args], {
    cwd
  });
  console.log('\n', proc.spawnCommand, '\n');
  proc.stdout.pipe(stdout);
  proc.stderr.pipe(stderr);
  await proc.promise;
}
/**
 * Invoke package's main function
 */


async function bestie({
  from = 'src',
  to = 'build',
  args = [],
  stdout = process.stdout,
  stderr = process.stderr,
  cwd = process.cwd()
} = {}) {
  await singleBuild(from, to, args, {
    cwd,
    stderr,
    stdout
  });
}

var _default = bestie;
exports.default = _default;