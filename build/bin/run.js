"use strict";const { resolve } = require('path');
const linkModules = require('../link-module');

(async () => {
  await linkModules(resolve(__dirname, 'register.js'), []);
})();