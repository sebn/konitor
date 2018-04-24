'use strict';

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _path = require('path');

var _package = require('../package.json');

var _logo = require('./helpers/logo');

var _interactive = require('./interactive');

var _interactive2 = require('./helpers/interactive');

var _pulls = require('./pulls');

var _test = require('./test');

var _list = require('./list');

var _check = require('./check');

var _check2 = _interopRequireDefault(_check);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// simple-git supposes that git is in english or else won't work
process.env.LANG = 'en';

_yargs2.default // eslint-disable-line no-unused-expressions
.version(_package.version).usage('Usage: $0 <command> [options]').command({
  command: 'pulls',
  desc: 'Pull all konnectors',
  handler: async () => {
    (0, _logo.displayLogo)();
    console.log(`Pull all konnectors:\n`);
    const konnectors = await (0, _list.getKonnectors)();
    await (0, _pulls.pulls)(konnectors);
    console.log();
  }
}).command({
  command: 'test <name> [options]',
  desc: 'Test a konnector',
  builder: {
    config: {
      alias: 'c',
      default: false,
      description: 'Path to a config file'
    },
    interactive: {
      alias: 'i',
      default: true,
      description: 'Launch interactive mode'
    }
  },
  handler: async ({ name, config, interactive }) => {
    (0, _logo.displayLogo)();
    (0, _interactive2.setInteractive)(interactive);
    console.log(`Test konnector ${name}:\n`);
    const konnector = await (0, _list.getKonnector)(name);
    const code = await (0, _test.testKonnector)(config, konnector);
    console.log();
    process.exit(code);
  }
}).command({
  command: 'testit <path> [options]',
  desc: 'Test from a konnector',
  builder: {
    config: {
      alias: 'c',
      default: false,
      description: 'Path to a config file'
    },
    interactive: {
      alias: 'i',
      default: true,
      description: 'Launch interactive mode'
    }
  },
  handler: async ({ path, config, interactive }) => {
    (0, _logo.displayLogo)();
    (0, _interactive2.setInteractive)(interactive);
    if (!(0, _path.isAbsolute)(path)) {
      path = (0, _path.resolve)(process.cwd(), path);
    }
    const konnector = await (0, _list.getKonnectorFromPath)(path);
    console.log(`Test konnector ${konnector.slug}:\n`);
    const code = await (0, _test.testKonnector)(config, konnector);
    console.log();
    process.exit(code);
  }
}).command({
  command: 'interactive',
  aliases: ['$0'],
  desc: 'Launch interactive mode',
  handler: async () => {
    (0, _logo.displayLogo)();
    await (0, _interactive.interactive)();
  }
}).command({
  command: 'check <repositories...>',
  desc: 'Do some prepublish test on a list of paths',
  handler: async options => {
    const code = await (0, _check2.default)(options);
    process.exit(code);
  }
}).locale('en').argv;