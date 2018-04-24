'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.launchCmd = exports.hasCmd = exports.getLibVersion = exports.getVersion = exports.getRepository = undefined;

var _clui = require('clui');

var _clui2 = _interopRequireDefault(_clui);

var _child_process = require('child_process');

var _interactive = require('./interactive');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getPackage = path => {
  const pkg = require(`${path}/package.json`);

  return pkg;
};

const getRepository = exports.getRepository = path => {
  const pkg = getPackage(path);

  return pkg.repository && pkg.repository.url;
};

const getVersion = exports.getVersion = async path => {
  const pkg = getPackage(path);

  return pkg.version;
};

const getLibVersion = exports.getLibVersion = (path, lib) => {
  const pkg = getPackage(path);

  return pkg.dependencies[lib] || pkg.devDependencies[lib];
};

const hasCmd = exports.hasCmd = (path, cmd) => {
  const pkg = getPackage(path);

  return !!pkg.scripts[cmd];
};

const launchCmd = exports.launchCmd = async (path, params, spinnerMsg) => {
  return new Promise(async resolve => {
    const Spinner = _clui2.default.Spinner;
    const status = new Spinner(spinnerMsg);

    if ((0, _interactive.isInteractive)()) {
      status.start();
    } else {
      console.log(` ${spinnerMsg}`);
    }

    const result = { stdout: [], stderr: [] };
    const cmd = await (0, _child_process.spawn)('yarn', params, { cwd: path, encoding: 'utf8' });
    cmd.stdout.on('data', data => result.stdout.push(data.toString()));
    cmd.stderr.on('data', data => result.stderr.push(data));

    cmd.on('close', code => {
      result.code = code;
      if ((0, _interactive.isInteractive)()) status.stop();
      resolve(result);
    });
  });
};