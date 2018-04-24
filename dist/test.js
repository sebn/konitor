'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.testKonnector = undefined;

var _config = require('./helpers/config');

var _package = require('./helpers/package');

var _manifest = require('./helpers/manifest');

var _filesystem = require('./helpers/filesystem');

var _questions = require('./helpers/questions');

var _pulls = require('./pulls');

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const testKonnector = exports.testKonnector = async (config, konnector) => {
  const { path, repoName, update } = konnector;

  // up to date
  if (update) {
    try {
      await (0, _pulls.pull)(konnector);
      console.log(` - ✅  repository is up to date.`);
    } catch (e) {
      console.log(e);
    }
  }

  // dependencies
  await (0, _package.launchCmd)(path, ['install'], `Install dependencies of ${repoName}, please wait...`);
  console.log(` - ✅  dependencies is installed.`);

  // clean
  const hasCleanCmd = await (0, _package.hasCmd)(path, 'clean');
  if (hasCleanCmd) {
    await (0, _package.launchCmd)(path, ['clean'], `Clean repository, please wait...`);
    console.log(` - ✅  repository is clean.`);
  }

  if (config) {
    _fsExtra2.default.copyFileSync(config, `${path}/konnector-dev-config.json`);
  } else {
    // create credentials
    const slug = await (0, _manifest.getSlug)(path);
    const fieldsFromManifest = await (0, _manifest.getFields)(path);
    const fields = {};
    for (const field of fieldsFromManifest) {
      let value = (0, _config.getKonnectorField)(slug, field);
      if (!value) {
        value = await (0, _questions.askKonnectorField)(slug, field);
        (0, _config.setKonnectorField)(slug, field, value);
      }
      fields[field] = value;
    }

    // create file with credentials
    const template = { COZY_URL: 'http://cozy.tools:8080', fields };
    _fsExtra2.default.writeFileSync(`${path}/konnector-dev-config.json`, JSON.stringify(template, null, '  '));
  }

  // Launch standalone test
  const result = await (0, _package.launchCmd)(path, ['standalone'], `Launch test, please wait...`);

  // Test
  let failed = false;
  if (result.code === 0) {
    console.log(` - ✅  Correctly executed.`);
  } else {
    failed = true;
    console.log(` - ⚠️  Finished with error.`);
  }
  if ((0, _lodash.includes)(result.stdout.join(', '), 'Correctly logged in') || (0, _lodash.includes)(result.stdout.join(', '), 'Successfully logged in')) {
    console.log(` - ✅  Correctly logged in.`);
  } else {
    failed = true;
    console.log(` - ⚠️  Login failed.`);
  }
  const files = await (0, _filesystem.getFilesFromDir)(path, 'PDF');
  if (files.length > 0) {
    console.log(` - ✅  PDF is imported.`);
  } else {
    failed = true;
    console.log(` - ⚠️  No PDF.`);
  }

  // clean
  if (hasCleanCmd) {
    await (0, _package.launchCmd)(path, ['clean'], `Clean repository, please wait...`);
    console.log(` - ✅  repository is clean.`);
  }

  // Show conector's output on failure
  if (failed) {
    console.log('\n--------------------------------------------------\n');
    console.log(result.stdout.join(''));
    console.log('\n--------------------------------------------------\n');
  }

  return result.code;
};