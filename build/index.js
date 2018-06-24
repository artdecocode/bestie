"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = require("path");

var _wrote = require("wrote");

var _fs = require("fs");

var _lib = require("./lib");

const NODE_MODULES = (0, _path.resolve)(__dirname, '../node_modules');

const sl = async (...args) => {
  for (let i = 0; i < args.length; i++) {
    const p = args[i];
    await new Promise(async (r, j) => {
      const path = (0, _path.resolve)('node_modules', p);
      const target = (0, _path.resolve)(NODE_MODULES, p);
      const e = await (0, _wrote.exists)(path);
      if (e) return r();
      console.log('symlinking %s', target);
      (0, _fs.symlink)(target, path, er => {
        return er ? j(er) : r();
      });
    });
  }
};
/**
 * Build the files.
 */


async function bestie({
  from = 'src',
  to = 'build',
  args = [],
  stdout = process.stdout,
  stderr = process.stderr,
  cwd = process.cwd()
} = {}) {
  const e = await (0, _wrote.exists)((0, _path.resolve)('node_modules', '@babel'));

  if (e) {
    await _lib.modules.reduce(async (a, c) => {
      await a;
      await sl(c);
    }, 1);
  } else {
    await sl('@babel');
  }

  await sl('babel-plugin-transform-rename-import');
  await (0, _lib.singleBuild)(from, to, args, {
    cwd,
    stderr,
    stdout
  });
}

var _default = bestie;
exports.default = _default;