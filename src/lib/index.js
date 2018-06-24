import spawn from 'spawncommand'
import { resolve, relative } from 'path'

export async function singleBuild(from, to, args, {
  cwd = process.cwd(),
  stdout,
  stderr,
}) {
  const babelpath = relative(cwd, require.resolve('@babel/cli/bin/babel.js'))
  const proc = spawn(babelpath, [
    from,
    '--out-dir',
    to,
    ...args,
  ], { cwd })

  console.log('\n', proc.spawnCommand, '\n')
  proc.stdout.pipe(stdout)
  proc.stderr.pipe(stderr)

  await proc.promise
}

export const modules = [
  '@babel/cli',
  '@babel/core',
  '@babel/register',
  '@babel/plugin-syntax-object-rest-spread',
  '@babel/plugin-transform-modules-commonjs',
  'babel-plugin-transform-rename-import',
]

export const makeSSd = (sd, dir) => {
  const ssd = sd.map(({ path, ...pckg }) => { // path to node modules
    const packagePath = resolve(dir, path, '..')
    const rel = relative(dir, packagePath)
    if (rel == 'bestie') return undefined
    const pc = resolve(packagePath, 'package.json')
    const { devDependencies } = require(pc)
    return {
      rel,
      devDependencies,
      packagePath,
      path,
      ...pckg,
    }
  })
  return ssd
}

export const filterInstalled = (mods, devDependencies, rel = 'unknown') => {
  const d = Object.keys(devDependencies)
  return mods.filter((m) => {
    const i = d.some(key => key.startsWith(m))
    if (!i) console.log('%s not installed for %s', m, rel)
    return i
  })
}
