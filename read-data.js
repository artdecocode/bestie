const { default: tablature } = require('tablature')

const c1 = require('./data/cache-1')
const d1 = require('./data/deps-1')
const c2 = require('./data/cache-2')
const c3 = require('./data/cache-3')

const data = c1.map(({ size, path }, i) => {
  const size2 = c2[i].size
  const size3 = c3[i].size
  const v = d1[i]['@babel/cli']
  const b = parseInt(size)
  const a = parseInt(size3)
  return {
    name: path.replace('node_modules', ''),
    v: v || '',
    size: b,
    size2: parseInt(size2),
    size3: a,
    final: Math.floor(((b - a)/a) * 10) / 10,
  }
})
const total = data.reduce((acc, item) => {
  const keys = Object.keys(item).filter(k => k != 'name' && k != 'v')
  keys.forEach((key) => {
    const val = item[key]
    let v
    if (!acc[key]) {
      v = parseInt(val, 10)
    } else {
      v = acc[key] + val
    }
    acc = {
      ...acc,
      [key]: v,
    }
  })
  return acc
}, { name: 'total' })

const getSize = (s) => {
  return Math.round(s / 1024) + ' MB'
}
total.final = Math.round(((total.size - total.size3)/total.size3))
total.size = getSize(total.size)
total.size2 = getSize(total.size2)
total.size3 = getSize(total.size3)
total.v = ''

const t = tablature({
  data: [...data, total],
  keys: ['name', 'v', 'size', 'size2', 'size3', 'final'],
  replacements: {
    final(val) {
      if (!val) return { value: '-', length: 1 }
      const value = `x${val}`
      return { value, length: value.length }
    },
    v(val) {
      if (!val) return { value: '-', length: 1 }
      const [, value] = /.+?-beta.(\d+)/.exec(val)
      return { value, length: value.length }
    },
  },
})

// console.log(t.replace(/\[0m/g, '').replace(/\[1m/g, ''))
// const d = [...data, total]

const headings = Object.keys(data[0])

console.log(JSON.stringify([
  headings,
  ...[...data, total].map((i) => {
    i.name  = i.name.replace(/^\.\/(.+?)\/$/, (m, a) => a)
    i.final = `x${i.final}`
    const r = headings.map(h => {
      const v = i[h]
      return v
    })
    return r
  }),
]))
