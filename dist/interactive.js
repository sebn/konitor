'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.interactive = undefined;

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _list = require('./list');

var _pulls = require('./pulls');

var _test = require('./test');

var _questions = require('./helpers/questions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const interactive = exports.interactive = async () => {
  const konnectors = await (0, _list.getKonnectors)();
  const name = 'name';
  const message = 'What do you want to do?';

  const aPulls = 'Pull all konnectors';
  const aTest = 'Test a konnector';
  const aQuit = 'Quit';

  const question = {
    type: 'list',
    name,
    message,
    choices: [aTest, aPulls, aQuit]
  };

  let answer;
  while (answer !== aQuit) {
    answer = (await _inquirer2.default.prompt(question))[name];
    console.log();

    switch (answer) {
      case aPulls:
        {
          await (0, _pulls.pulls)(konnectors);
          break;
        }
      case aTest:
        {
          const konnector = await (0, _questions.selectKonnector)(konnectors);
          await (0, _test.testKonnector)(false, konnector);
          break;
        }
    }
    console.log();
  }
};