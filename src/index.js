import { resolve } from 'path'
import { exists } from 'wrote'
import { symlink } from 'fs'
import { singleBuild } from './lib'

const NODE_MODULES = resolve(__dirname, '../node_modules')

const sl = async (...args) => {
  for (let i=0; i<args.length; i++) {
    const p = args[i]

    await new Promise(async (r, j) => {
      const path = resolve('node_modules', p)
      const target = resolve(NODE_MODULES, p)
      const e = await exists(path)
      if (e) return r()
      console.log('symlinking %s', target)
      symlink(target, path, er => {
        return (er ? j(er) : r())
      })
    })
  }
}

/**
 * Build the files.
 */
async function bestie({
  from = 'src', to = 'build', args = [],
  stdout = process.stdout, stderr = process.stderr,
  cwd = process.cwd(),
} = {}) {
  await sl('@babel', 'babel-plugin-transform-rename-import')
  await singleBuild(from, to, args, {
    cwd,
    stderr,
    stdout,
  })
}

export default bestie
