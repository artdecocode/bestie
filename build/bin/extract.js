"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = require("path");

var _fs = require("fs");

var _makepromise = _interopRequireDefault(require("makepromise"));

var _spawncommand = _interopRequireDefault(require("spawncommand"));

var _bosom = _interopRequireDefault(require("bosom"));

var _tablature = _interopRequireDefault(require("tablature"));

var _lib = require("../lib");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const dir = resolve(process.cwd())

/**
 * Update information about directory's content with lstat.
 * @param {string} dirPath Path to the root directory
 * @param {string[]} dirContent
 * @returns {File[]} An array with file objects.
 */
async function lstatFiles(dirPath, dirContent) {
  const readFiles = dirContent.map(async relativePath => {
    const path = (0, _path.resolve)(dirPath, relativePath);
    const ls = await (0, _makepromise.default)(_fs.lstat, path);
    return {
      lstat: ls,
      path,
      relativePath
    };
  });
  return Promise.all(readFiles);
}

const getCache = async () => {
  try {
    const res = await (0, _bosom.default)('bestie-cache.json');
    return res;
  } catch (err) {
    return '';
  }
};

const extract = async _extract => {
  try {
    // let sd = await getCache()
    // if (!sd) {
    const dir = _extract;
    const d = await (0, _makepromise.default)(_fs.readdir, dir);
    const ls = await lstatFiles(dir, d);
    const p = ls.map(({
      path
    }) => {
      return `./${(0, _path.relative)(dir, path)}/node_modules`;
    });
    const s = (0, _spawncommand.default)('du', ['-s', ...p], {
      cwd: dir
    }); // s.stderr.pipe(process.stderr)

    const {
      stdout
    } = await s.promise; // writeFileSync('sizes.txt', stdout)

    const sd = split(stdout); // await bosom('bestie-cache.json', sd)
    // }

    const ssd = (0, _lib.makeSSd)(sd, dir).filter(a => a).sort(({
      size: sizeA
    }, {
      size: sizeB
    }) => {
      const pa = parseInt(sizeA);
      const pb = parseInt(sizeB);
      if (pb > pa) return 1;
      if (pa > pb) return -1;
      return 0;
    });
    const t = (0, _tablature.default)({
      keys: ['rel', 'size'],
      data: ssd,
      replacements: {
        size(val) {
          const value = `${Math.round(val / 1024 * 10) / 10} MB`;
          return {
            value,
            length: value.length
          };
        }

      }
    });
    console.log(t);
    return; // const json = JSON.stringify(ssd.map(({ devDependencies }) => devDependencies), null, 2)
    // writeFileSync('deps.txt', json)
    // await ssd.reduce(async (acc, { rel, packagePath, devDependencies }) => {
    //   await acc
    //   const mods = ['eslint']
    //   const installed = mods.filter((m) => {
    //     const i = Object.keys(devDependencies).some(key => key.startsWith(m))
    //     if (!i) console.log('%s not installed for %s', m, rel)
    //     return i
    //   })
    //   if (!installed.length) {
    //     return
    //   }
    //   console.log('removing eslint from %s', rel)
    //   const p = spawn('yarn', ['remove', ...installed], {
    //     cwd: packagePath,
    //   })
    //   p.stdout.pipe(process.stdout)
    //   p.stderr.pipe(process.stderr)
    //   await p.promise
    // }, {})
    // debugger
  } catch (err) {
    console.log(err);
  }
};

var _default = extract;
exports.default = _default;

const split = body => {
  const re = /(\d+?)\s+(.+)/mg;
  let r;
  const res = [];

  while ((r = re.exec(body)) !== null) {
    const [, size, path] = r;
    res.push({
      size,
      path
    });
  }

  return res;
};