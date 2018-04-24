'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGitlabRepositories = exports.getGithubRepositories = exports.getRepositories = exports.parsingRepository = undefined;

var _list = require('../../list.json');

var _list2 = _interopRequireDefault(_list);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const REPO_REGEXP = /^(git\+)?https?:\/\/([a-zA-Z0-9-_.]+)\/([a-zA-Z0-9-_.]+)\/([a-zA-Z0-9-_.]+)$/;
const PROVIDER_GITHUB = 'github.com';
const PROVIDER_GITLAB = 'gitlab.cozycloud.cc';

const parsingRepository = exports.parsingRepository = url => {
  const matching = url.match(REPO_REGEXP);
  return {
    provider: matching[2] === PROVIDER_GITHUB ? 'Github' : 'Gitlab',
    owner: matching[3],
    repoName: matching[4],
    url
  };
};

const getRepositories = exports.getRepositories = (provider = '') => {
  const list = [];

  for (const repo of _list2.default) {
    if ((0, _lodash.includes)(repo, provider)) {
      list.push(parsingRepository(repo));
    }
  }

  return list;
};

const getGithubRepositories = exports.getGithubRepositories = () => {
  return getRepositories(PROVIDER_GITHUB);
};

const getGitlabRepositories = exports.getGitlabRepositories = () => {
  return getRepositories(PROVIDER_GITLAB);
};