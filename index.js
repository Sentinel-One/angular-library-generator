#!/usr/bin/env node
const args = process.argv.slice(2);
const {Plop, run} = require('plop');
const argv = require('minimist')(args);

Plop.launch({
    cwd: argv.cwd,
    configPath: `${__dirname}/plopfile.js`, // changed to `${process.cwd()}/plopfile.js` in my case
    require: argv.require,
    completion: argv.completion
}, run);
