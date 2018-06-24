import { singleBuild } from './lib'

/**
 * Build the files.
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
