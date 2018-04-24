'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getKonnectors = exports.getKonnector = exports.getKonnectorFromPath = undefined;

var _list = require('./helpers/list');

var _config = require('./helpers/config');

var _package = require('./helpers/package');

var _manifest = require('./helpers/manifest');

const getKonnectorFromPath = exports.getKonnectorFromPath = async path => {
  const repository = (0, _package.getRepository)(path);
  const konnector = (0, _list.parsingRepository)(repository);

  const slug = await (0, _manifest.getSlug)(path);
  konnector.slug = slug;
  konnector.path = path;

  return konnector;
};

const getKonnector = exports.getKonnector = async name => {
  const konnectors = await getKonnectors();
  const konnector = konnectors.find(k => k.slug === name || k.repoName === name);
  konnector.update = true;

  return konnector;
};

const getKonnectors = exports.getKonnectors = async () => {
  const konnectors = await (0, _list.getGithubRepositories)();

  for (const konnector of konnectors) {
    const path = await (0, _config.getKonnectorPath)(konnector.repoName);
    konnector.path = path;
    try {
      const slug = await (0, _manifest.getSlug)(path);
      konnector.slug = slug;
    } catch (e) {
      // this project are not yet downloaded
    }
  }

  return konnectors;
};