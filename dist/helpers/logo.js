'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.displayLogo = undefined;

var _clear = require('clear');

var _clear2 = _interopRequireDefault(_clear);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _figlet = require('figlet');

var _figlet2 = _interopRequireDefault(_figlet);

var _package = require('../../package.json');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const displayLogo = exports.displayLogo = () => {
  (0, _clear2.default)();
  console.log(_chalk2.default.yellow(_figlet2.default.textSync('konitor', { horizontalLayout: 'full' })));
  console.log(` v${_package.version}\n`);
};