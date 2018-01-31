const assert = require('assert')
const context = require('../context/')
const bestie = require('../../src/')

const bestieTestSuite = {
    context,
    'should be a function': () => {
        assert.equal(typeof bestie, 'function')
    },
    'should call package without error': () => {
        assert.doesNotThrow(() => {
            bestie()
        })
    },
}

module.exports = bestieTestSuite
