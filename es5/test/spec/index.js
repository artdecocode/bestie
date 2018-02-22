var assert = require('assert');

var context = require('../context/');

var bestie = require('../..');

var bestieTestSuite = {
  context,
  'should be a function': function shouldBeAFunction() {
    assert.equal(typeof bestie, 'function');
  },

  'should call package without error'() {
    return new Promise(function ($return, $error) {
      return Promise.resolve(bestie()).then(function ($await_1) {
        try {
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  }

};
module.exports = bestieTestSuite;