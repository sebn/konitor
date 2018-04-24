'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGithubToken = exports.getGithubCredentials = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _clui = require('clui');

var _clui2 = _interopRequireDefault(_clui);

var _rest = require('@octokit/rest');

var _rest2 = _interopRequireDefault(_rest);

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const github = (0, _rest2.default)();

const getGithubCredentials = exports.getGithubCredentials = async () => {
  const questions = [{
    name: 'username',
    type: 'input',
    message: 'Enter your Github username or e-mail address:',
    validate: login => {
      if (login.length) {
        return true;
      } else {
        return 'Please enter your username or e-mail address';
      }
    }
  }, {
    name: 'password',
    type: 'password',
    message: 'Enter your password:',
    validate: password => {
      if (password.length) {
        return true;
      } else {
        return 'Please enter your password';
      }
    }
  }];

  return _inquirer2.default.prompt(questions);
};

const getGithubToken = exports.getGithubToken = async () => {
  const config = (0, _config.getGithubToken)();

  if (config) {
    return config;
  }

  const credentials = await getGithubCredentials();

  const Spinner = _clui2.default.Spinner;
  const status = new Spinner('Authenticating you, please wait...');
  status.start();

  github.authenticate(_extends({ type: 'basic' }, credentials));
  try {
    const result = await github.authorization.create({
      scopes: ['user', 'public_repo', 'repo', 'repo:status'],
      note: 'konitor, the command-line tool for monitoring konnectors',
      note_url: 'https://github.com/konnectors/konitor'
    });
    status.stop();

    const token = result.data && result.data.token;
    if (token) {
      (0, _config.setGithubToken)(token);
      return token;
    }
  } catch (e) {
    status.stop();

    const message = JSON.parse(e.message);

    if (message.message === 'Bad credentials') {
      console.log('##');
      console.warn(` ⚠️  ${message.message}`);
      console.log();

      return getGithubToken();
    } else if (message.errors && message.errors.length > 0 && message.errors[0].code === 'already_exists') {
      throw new Error(`Token is already exists, you can remove it: https://github.com/settings/tokens`);
    } else {
      throw new Error(message.message);
    }
  }
};