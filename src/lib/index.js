import spawn from 'spawncommand'

const babelpath = require.resolve('@babel/cli/bin/babel.js')

async function singleBuild(from, to, args, {
  cwd = process.cwd(),
  stdout,
  stderr,
}) {
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

/**
 * Invoke package's main function
 */
async function bestie({
  from = 'src', to = 'build', args = [],
  stdout = process.stdout, stderr = process.stderr,
  cwd = process.cwd(),
} = {}) {
  await singleBuild(from, to, args, {
    cwd,
    stderr,
    stdout,
  })
}

export default bestie
