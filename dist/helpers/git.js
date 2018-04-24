'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pull = undefined;

var _promise = require('simple-git/promise');

var _promise2 = _interopRequireDefault(_promise);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const pull = exports.pull = async (path, url) => {
  await _fsExtra2.default.ensureDir(path);
  const git = (0, _promise2.default)(path);

  const isRepo = await git.checkIsRepo();
  if (!isRepo) {
    await git.init();
    await git.addRemote('origin', url);
  }

  return git.pull('origin', 'master', '--rebase=true');
};