const assert = require('assert')
const context = require('../context/')
const bestie = require('../..')

const bestieTestSuite = {
  context,
  'should be a function': () => {
    assert.equal(typeof bestie, 'function')
  },
  async 'should call package without error'() {
    await bestie()
  },
}

module.exports = bestieTestSuite
