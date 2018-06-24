#!/usr/bin/env node
import { createWritable, write } from 'wrote'
import { createReadStream } from 'fs'
import { resolve } from 'path'
import argufy from 'argufy'
import usually from 'usually'
import spawn from 'spawncommand'
import { askSingle } from 'reloquent'
import bosom from 'bosom'
import { c } from 'erte'
import bestie from '..'
import extract from './extract'
import { modules, makeSSd, filterInstalled, filterNotInstalled } from '../lib'

const {
  init: _init,
  from: _from = 'src',
  'out-dir': _to = 'build',
  _argv,
  extract: _extract,
  help: _help,
  install: _install,
  uninstall: _uninstall,
} = argufy({
  init: { short: 'i', boolean: true },
  help: { short: 'h', boolean: true },
  from: { command: true },
  'out-dir': 'd',
  args: { short: 'a' },
  extract: { short: 'e' },
  install: { short: 'I', boolean: true },
  uninstall: { short: 'U', boolean: true },
})

const readable = resolve(__dirname, '../rc.json')
const babelrc = resolve(process.cwd(), '.babelrc')

async function init() {
  const rs = createReadStream(readable)
  const ws = await createWritable(babelrc)
  await write(ws, rs)
}

/*
bestie build [some/dir] [dest] [--copy-files] [--include-dotfiles] ...
bestie test
bestie watch
*/

const u = usually({
  usage: {
    '--help, -h': 'Print the help message.',
    '--init, -i': 'Write the .babelrc in the current directory.',
    '--install, -I': 'Add @babel dependencies.',
    '--uninstall, -U': 'Remove @babel dependencies from the current directory.',
  },
  line: 'bestie [src] [--out-dir build] [[--copy-files] --etc] | -iIU',
  description: `A command-line tool to build packages.
  Source is the first argument, followed by any additional arguments
  Default source is src and default out-dir is build.
  Any other additional arguments are passed along to babel.
`,
  example: 'bestie src --out-dir build --copy-files',
})

if (_help) {
  console.log(u)
  process.exit()
}

const readName = async () => {
  try {
    const { name } = await bosom('package.json')
    return name
  } catch (err) {
    throw new Error('Cannot read package.json on the current package')
  }
}

(async () => {
  if (_extract) {
    await extract(_extract)
    return
  }

  try {
    if (_init) {
      await init()
      console.log('Written .babelrc file in the current directory')
      return
    }
    if (_install) {
      const name = await readName()
      const [{ devDependencies }] = makeSSd([{ path: 'node_modules' }], '.')
      const i = filterNotInstalled(modules, devDependencies)
      if (!i.length) {
        console.log('Nothing to install for %s', name)
        return
      }
      const p = spawn('yarn', [
        'add',
        '-DE',
        ...modules,
      ])
      p.stderr.pipe(process.stderr)
      p.stdout.pipe(process.stdout)
      await p.promise
      return
    }
    if (_uninstall) {
      const name = await readName()
      const [{ devDependencies }] = makeSSd([{ path: 'node_modules' }], '.')
      const i = filterInstalled(modules, devDependencies)
      const titles = i.map(j => `${j}@${devDependencies[j]}`)
      if (!i.length) {
        console.log('No @babel dependencies to remove for %s', name)
        return
      }
      const y = await askSingle({
        text: `Continue removing\n ${titles.map(a => c(a, 'grey')).join('\n ')}\nfrom ${name}?`,
        defaultValue: 'y',
      })
      if (y != 'y') return
      const p = spawn('yarn', [
        'remove',
        '-DE',
        ...i,
      ])
      p.stderr.pipe(process.stderr)
      p.stdout.pipe(process.stdout)
      await p.promise
      return
    }

    await bestie({
      from: _from,
      to: _to,
      args: _argv,
    })
  } catch (err) {
    console.log(err)
  }
})()

