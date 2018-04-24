'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.askKonnectorField = exports.selectKonnector = undefined;

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _lodash = require('lodash');

var _interactive = require('./interactive');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const name = 'name';

const selectKonnector = exports.selectKonnector = async konnectors => {
  const message = 'Which konnector do you want to test?';
  const question = {
    type: 'list',
    name,
    message,
    choices: konnectors.map(k => k.slug === undefined ? k.repoName : k.slug)
  };
  const answer = (await _inquirer2.default.prompt(question))[name];
  console.log();

  return (0, _lodash.find)(konnectors, k => k.slug === answer || k.repoName === answer);
};

const askKonnectorField = exports.askKonnectorField = async (slug, field) => {
  if ((0, _interactive.isInteractive)()) {
    const message = `What's '${field}' for konnector '${slug}'?`;
    const question = {
      type: field === 'password' ? 'password' : 'input',
      name,
      message
    };
    const answer = (await _inquirer2.default.prompt(question))[name];

    return answer;
  } else {
    throw new Error(`Field '${field}' for konnector '${slug}' isn't set.`);
  }
};