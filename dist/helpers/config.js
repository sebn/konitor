'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getKonnectorField = exports.setKonnectorField = exports.setGithubToken = exports.getGithubToken = exports.getKonnectorPath = exports.getConfigPath = undefined;

var _configstore = require('configstore');

var _configstore2 = _interopRequireDefault(_configstore);

var _path = require('path');

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _package = require('../../package.json');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const conf = new _configstore2.default(_package.name);

const getConfigPath = exports.getConfigPath = async () => {
  const filePath = conf.path;
  const dir = (0, _path.dirname)(filePath) + '/' + _package.name;
  await _fsExtra2.default.ensureDir(dir);

  return dir;
};

const getKonnectorPath = exports.getKonnectorPath = async repoName => {
  const configPath = await getConfigPath();

  return `${configPath}/${repoName}`;
};

const getGithubToken = exports.getGithubToken = () => {
  return conf.get('github.token');
};

const setGithubToken = exports.setGithubToken = token => {
  conf.set('github.token', token);
};

const setKonnectorField = exports.setKonnectorField = (slug, field, value) => {
  conf.set(`konnector.${slug}.${field}`, value);
};

const getKonnectorField = exports.getKonnectorField = (slug, field) => {
  const fromEnv = process.env[`FIELD_${field.toUpperCase()}`];
  if (fromEnv) {
    return fromEnv;
  }

  if (process.env.KONNECTOR_CONFIG) {
    const config = JSON.parse(process.env.KONNECTOR_CONFIG);
    if (config && config.fields && config.fields[field]) {
      return config.fields[field];
    }
  }

  return conf.get(`konnector.${slug}.${field}`);
};