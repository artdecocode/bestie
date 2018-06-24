import { assert } from 'zoroaster/assert'
import Context from '../context'
import bestie from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function': () => {
    assert.equal(typeof bestie, 'function')
  },
  async 'compiles files with regular expression'({ packagePath, buildPath }) {
    await bestie()
  },
}

export default T
