import path from 'path'
import fs from 'fs'
import yaml from 'js-yaml'
import { execSync } from 'child_process'

const lintedByEslintPrettier = {
  fn: (info, assert) => {
    const eslintConfig = info.pkg.eslintConfig
    assert(
      eslintConfig && eslintConfig.extends.indexOf('prettier') > -1,
      'eslintConfig should extend from prettier'
    )
  },
  message:
    'Eslint with prettier is used to lint the code (check for eslintConfig in package.json)'
}

const hasFieldsInManifest = {
  fn: info => {
    const fields = info.manifest.fields
    return Boolean(fields)
  },
  message: 'Fields (necessary for login) are defined in manifest.konnector'
}

const travisUsedToDeployBuildAndLatest = {
  fn: (info, assert) => {
    let travis
    try {
      travis = yaml.safeLoad(info.read('.travis.yml'))
      if (!travis.deploy || travis.deploy.length !== 2) {
        return false
      }
    } catch (e) {
      assert(travis, 'Travis file should be present')
      return false
    }
    assert(
      travis.deploy[0].on.branch == 'master',
      'First deployment target should be on branch master'
    )
    assert(
      travis.deploy[0].script == 'yarn deploy',
      'Master should be deployed to build branch'
    )
    assert(
      travis.deploy[1].on.branch == 'prod',
      'First deployment target should be on branch prod'
    )
    assert(
      travis.deploy[1].script == 'yarn deploy:prod' ||
        travis.deploy[1].script == 'DEPLOY_BRANCH=latest yarn deploy',
      'Prod should be deployed to latest branch'
    )
    return true
  },
  message: 'Travis is correctly configured to deploy master/prod'
}

const renovateIsConfigured = {
  fn: (info, assert) => {
    let renovate
    try {
      renovate = JSON.parse(info.read('renovate.json'))
    } catch (e) {
      renovate = info.pkg.renovate
    }
    assert(
      renovate,
      'Renovate should be configured in renovate.json or in package.json'
    )
    assert(
      renovate && renovate.extends.indexOf('cozy-konnector') > 0,
      'Renovate config should extend from the cozy-konnector config'
    )
    return true
  },
  message: 'Renovate should be correctly configured'
}

const repoShouldHave4Branches = {
  fn: (info, assert) => {
    ;['master', 'build', 'latest', 'prod'].forEach(branch => {
      assert(
        info.git.branches.indexOf('origin/' + branch) > -1,
        `Repository should have branch ${branch}`
      )
    })
  },
  message: 'Repository should have 4 branches'
}

const strip = str => str.replace(/^\s+/, '').replace(/\s+$/, '')

const prepareGitInfo = repository => {
  const workingDir = path.join(process.cwd(), repository)
  const branches = execSync('git branch -r', {
    cwd: workingDir
  })
    .toString()
    .split('\n')
    .map(line => strip(line))
  return {
    branches: branches
  }
}

const mkAssert = res => (assertion, warning) => {
  if (!assertion) {
    res.warnings.push(warning)
  }
}

const prepareInfo = repository => {
  const pkgFile = path.join(repository, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgFile))
  const manifestFile = path.join(repository, 'manifest.konnector')
  const manifest = JSON.parse(fs.readFileSync(manifestFile))
  return {
    pkg,
    manifest,
    git: prepareGitInfo(repository),
    read: fp => fs.readFileSync(path.join(repository, fp))
  }
}

const checks = [
  lintedByEslintPrettier,
  hasFieldsInManifest,
  travisUsedToDeployBuildAndLatest,
  renovateIsConfigured,
  repoShouldHave4Branches
]

const trueIfUndefined = res => res === undefined || res

export default function(options) {
  const repository = options.repository
  const info = prepareInfo(repository)
  console.log(`Checking ${repository}`)
  checks.forEach(check => {
    const res = { warnings: [] }
    const assert = mkAssert(res)
    const ok = trueIfUndefined(check.fn(info, assert))
    console.log(check.message, ok && res.warnings.length === 0 ? '✅' : '❌')
    if (res.warnings.length > 0) {
      for (let warning of res.warnings) {
        console.warn(' - ', warning, '❌')
      }
    }
    info.warnings = []
  })
}
