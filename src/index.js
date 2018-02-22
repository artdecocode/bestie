const spawncommand = require('spawncommand')
const { resolve, join } = require('path')
const { createWritable, write, readJSON, read } = require('wrote')

const babelpath = require.resolve('@babel/cli/bin/babel.js')

/**
 * Invoke package's main function
 */
async function bestie({
  dir = '.', destination = 'es5', args = [],
  stdout = process.stdout, stderr = process.stderr,
  cwd = process.cwd(),
} = {}) {
  const sources = dir === '.' ? ['src', 'test'] : dir.split(',')
  const destinations = sources.map(source => join(destination, source))

  const jobs = sources.reduce((acc, from, i) => {
    const to = destinations[i]
    return [...acc, { from, to }]
  }, [])

  for (let i = 0; i < jobs.length; i++) {
    const { from, to } = jobs[i]
    const proc = spawncommand(babelpath, [
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

  const { main } = await readJSON('package.json')
  const exports = (await read(resolve(__dirname, 'exports.js')))
    .replace('$MAIN', main.replace(/\/index\.js$/, ''))

  const path = join(destination, 'index.js')
  const ws = await createWritable(path)
  await write(ws, exports)
  console.log('%s now points to %s ', join(destination, 'index.js'), join(destination, main))
}

module.exports = bestie
