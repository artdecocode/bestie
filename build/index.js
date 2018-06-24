"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lib = require("./lib");

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
  await (0, _lib.singleBuild)(from, to, args, {
    cwd,
    stderr,
    stdout
  });
}

var _default = bestie;
exports.default = _default;