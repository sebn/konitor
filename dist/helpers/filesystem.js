'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFilesFromDir = undefined;

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getFilesFromDir = exports.getFilesFromDir = async (dir, extension) => {
  const dirCont = await _fsExtra2.default.readdir(dir);
  const re = new RegExp(`.*\.(${extension})`, 'ig'); // eslint-disable-line no-useless-escape
  const files = dirCont.filter(elm => elm.match(re));

  return files;
};