import bestie from '../src'

(async () => {
  await bestie({
    from: 'src',
    to: 'build',
    args: ['--copy-files', '--include-dotfiles'],
    stdout: process.stdout,
    stderr: process.stderr,
    cwd: process.cwd(),
  })
})()
