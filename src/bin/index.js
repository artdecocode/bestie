#!/usr/bin/env node

import { createWritable, write } from 'wrote'
import { createReadStream } from 'fs'
import { resolve } from 'path'
import argufy from 'argufy'
import usually from 'usually'
import spawn from 'spawncommand'
import bestie from '..'

const {
  init: _init,
  from: _from = 'src',
  'out-dir': _to = 'build',
  _argv,
  extract: _extract,
  help: _help,
  install: _install,
} = argufy({
  init: { short: 'i', boolean: true },
  help: { short: 'h', boolean: true },
  from: { command: true },
  'out-dir': '-d',
  args: { short: 'a' },
  extract: { short: 'e', boolean: true },
  install: { short: 'I', boolean: true },
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
    '--help, -h': 'print the help message',
    '--init, -i': 'write the .babelrc in the current directory',
  },
  line: 'bestie [src] [--out-dir build] [[--copy-files] --etc]',
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


const modules = [
  '@babel/cli',
  '@babel/core',
  '@babel/register',
  '@babel/plugin-syntax-object-rest-spread',
  '@babel/plugin-transform-modules-commonjs',
  'babel-plugin-transform-rename-import',
]

;(async () => {
  if (_extract) {
    require('./extract')
    return
  }

  try {
    if (_init) {
      await init()
      console.log('Written .babelrc file in the current directory')
      return
    }
    if (_install) {
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

    await bestie({
      from: _from,
      to: _to,
      args: _argv,
    })
  } catch (err) {
    console.log(err)
  }
})()

