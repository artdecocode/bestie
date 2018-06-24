import { resolve, relative } from 'path'
import { readdir, lstat, writeFileSync } from 'fs'
import makePromise from 'makepromise'
import spawn from 'spawncommand'
import bosom from 'bosom'

const dir = resolve(__dirname, '../../..')

/**
 * Update information about directory's content with lstat.
 * @param {string} dirPath Path to the root directory
 * @param {string[]} dirContent
 * @returns {File[]} An array with file objects.
 */
async function lstatFiles(dirPath, dirContent) {
  const readFiles = dirContent.map(async (relativePath) => {
    const path = resolve(dirPath, relativePath)
    const ls = await makePromise(lstat, path)
    return {
      lstat: ls,
      path,
      relativePath,
    }
  })
  return Promise.all(readFiles)
}

const getCache = async () => {
  try {
    const res = await bosom('cache.json')
    return res
  } catch (err) { return '' }
}

(async () => {
  try {
    let sd = await getCache()
    if (!sd) {
      const d = await makePromise(readdir, dir)
      const ls = await lstatFiles(dir, d)
      const p = ls.map(({ path }) => {
        return `./${relative(dir, path)}/node_modules`
      })
      const s = spawn('du', ['-s', ...p], {
        cwd: dir,
      })
      s.stderr.pipe(process.stderr)
      const { stdout } = await s.promise
      writeFileSync('sizes.txt', stdout)
      sd = split(stdout)

      await bosom('cache.json', sd)
    }

    const ssd = sd.map((pckg) => {
      const rel = relative(dir, pckg.packagePath)
      if (rel == 'bestie') return undefined
      const { packagePath } = pckg
      const p = resolve(packagePath, 'package.json')
      const { devDependencies } = require(p)
      return {
        rel,
        devDependencies,
        ...pckg,
      }
    }).filter(a => a)
    const json = JSON.stringify(ssd.map(({ devDependencies }) => devDependencies), null, 2)
    writeFileSync('deps.txt', json)

    await ssd.reduce(async (acc, { rel, packagePath, devDependencies }) => {
      await acc
      const mods = ['eslint']
      const installed = mods.filter((m) => {
        const i = Object.keys(devDependencies).some(key => key.startsWith(m))
        if (!i) console.log('%s not installed for %s', m, rel)
        return i
      })
      if (!installed.length) {
        return
      }
      console.log('removing eslint from %s', rel)
      const p = spawn('yarn', ['remove', ...installed], {
        cwd: packagePath,
      })
      p.stdout.pipe(process.stdout)
      p.stderr.pipe(process.stderr)
      await p.promise
    }, {})
    debugger
  } catch (err) {
    console.log(err)
  }
})()

const modules = [
  '@babel/cli',
  '@babel/core',
  '@babel/register',
  '@babel/plugin-syntax-object-rest-spread',
  '@babel/plugin-transform-modules-commonjs',
  'babel-plugin-transform-rename-import',
]

const split = (body) => {
  const re = /(\d+?)\s+(.+)/mg
  let r
  const res = []
  while((r = re.exec(body)) !== null) {
    const [, size, path] = r
    const packagePath = resolve(dir, path, '..')
    res.push({ size, path, packagePath })
  }
  return res
}
