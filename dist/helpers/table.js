'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pullTable = undefined;

var _ttyTable = require('tty-table');

var _ttyTable2 = _interopRequireDefault(_ttyTable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Table = (0, _ttyTable2.default)('automattic-cli-table');

const pullTable = exports.pullTable = () => {
  const options = {
    GUTTER: 0,
    marginTop: 0,
    marginBottom: 0
  };
  const displayHeader = () => {
    var table = new Table(options);
    table.push(['Status', 'Name', 'Changes', 'Insertions', 'Deletions']);
    console.log(table.toString());
  };
  const displayRow = (status, name, changes, insertions, deletions) => {
    var table = new Table(options);
    table.push([status, name, changes, insertions, deletions]);
    console.log(table.toString());
  };

  return { displayHeader, displayRow };
};