import spawn from 'spawncommand'
import { relative } from 'path'

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
