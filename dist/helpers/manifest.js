'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSlug = exports.getFields = exports.getManifest = undefined;

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getManifest = exports.getManifest = async path => {
  const manifest = await _fsExtra2.default.readJson(`${path}/manifest.konnector`);

  return manifest;
};

const getFields = exports.getFields = async path => {
  const manifest = await getManifest(path);

  const oldFormat = manifest.fields && manifest.fields.account && manifest.fields.account.accountFormat && manifest.fields.account.accountFormat.split(',');

  if (oldFormat) {
    return oldFormat;
  }

  const fields = [];
  Object.keys(manifest.fields).forEach(k => {
    if (k !== 'advancedFields' && (manifest.fields[k].isRequired === undefined || manifest.fields[k].isRequired === true)) {
      fields.push(k);
    }
  });

  return fields;
};

const getSlug = exports.getSlug = async path => {
  const manifest = await getManifest(path);

  return manifest.slug;
};