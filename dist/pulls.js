'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pull = exports.pulls = undefined;

var _clui = require('clui');

var _clui2 = _interopRequireDefault(_clui);

var _git = require('./helpers/git');

var _interactive = require('./helpers/interactive');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const pulls = exports.pulls = async konnectors => {
  for (const k of konnectors) {
    const result = await pull(k);
    console.log(` - ✅  ${k.repoName}: ${JSON.stringify(result.summary)}`);
  }
};

const pull = exports.pull = async konnector => {
  const { url, repoName, path } = konnector;
  const spinnerMsg = `Pull last change from ${repoName}, please wait...`;
  const Spinner = _clui2.default.Spinner;
  const status = new Spinner(spinnerMsg);
  if ((0, _interactive.isInteractive)()) {
    status.start();
  } else {
    console.log(` ${spinnerMsg}`);
  }

  let result;
  try {
    result = await (0, _git.pull)(path, url);
  } catch (e) {
    if ((0, _interactive.isInteractive)()) status.stop();
    throw e;
  }

  if ((0, _interactive.isInteractive)()) status.stop();

  return result;
};