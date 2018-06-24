/**
 *
 * @param {string[]} argv
 * @param {*} long
 * @param {*} short
 * @param {*} bool
 * @param {*} number
 */
export const find = (argv, long, short, bool, number) => {
  const re = new RegExp(`^-(${short}|-${long})`)
  const i = argv.findIndex(a => re.test(a))
  if (i == -1) return { argv }

  if (bool) {
    return {
      value: true,
      argv: [
        ...argv.slice(0, i),
        ...argv.slice(i + 1),
      ],
    }
  }

  const j = i + 1
  let value = argv[j]

  if (!value || (typeof value == 'string' && value.startsWith('--'))) return { argv }

  if (number) {
    value = parseInt(value, 10)
  }
  return {
    value,
    argv: [
      ...argv.slice(0, i),
      ...argv.slice(j + 1),
    ],
  }
}

export const findTitles = argv => {
  const titles = []
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith('-')) break
    titles.push(a)
  }
  return titles
}
