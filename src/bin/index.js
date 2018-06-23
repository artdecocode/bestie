#!/usr/bin/env node

const { createWritable, write } = require('wrote')
const { createReadStream } = require('fs')
const { resolve } = require('path')
const bestie = require('..')

const defaultDestination = 'es5'
const defaultDir = '.'

const { argv: [, , d = defaultDir, dest = defaultDestination, ...args] } = process

const readable = resolve(__dirname, '../src/rc.json')
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
(async () => {
  try {
    if (d === 'init') {
      await init()
      return
    }

    let destination
    let dir

    if (dest.startsWith('--')) {
      args.unshift(dest)
      destination = defaultDestination
    } else {
      destination = dest
    }

    if (d.startsWith('--')) {
      args.unshift(d)
      dir = defaultDir
    } else {
      dir = d
    }
    await bestie({
      dir,
      destination,
      args,
    })
  } catch (err) {
    console.log(err)
  }
})()
