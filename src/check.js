import path from 'path'
import fs from 'fs'
import yaml from 'js-yaml'
import { exec } from 'child_process'

const lintedByEslintPrettier = {
  fn: (info, assert) => {
    const eslintConfig = info.pkg && info.pkg.eslintConfig
    assert(
      eslintConfig &&
        eslintConfig.extends.indexOf('eslint-config-cozy-app') > -1,
      'eslintConfig should extend from prettier'
    )
  },
  nickname: 'eslint',
  link: 'https://github.com/konnectors/docs/blob/master/status.md#linting',
  message:
    'Eslint with prettier is used to lint the code (check for eslintConfig in package.json)'
}

const mandatoryFieldsInManifest = {
  fn: (info, assert) => {
    const mandatoryFields = [
      'version',
      'name',
      'type',
      'icon',
      'slug',
      'source',
      'editor',
      'vendor_link',
      'categories',
      'fields',
      'data_types',
      'permissions',
      'developer',
      'langs',
      'locales'
    ]

    const missingFields = mandatoryFields.filter(field => !info.manifest[field])
    const result = missingFields.length === 0
    assert(
      result,
      `Some fields are missing in the manifest ${JSON.stringify(missingFields)}`
    )
    return result
  },
  nickname: 'manifestAttributes',
  message: 'Mandatory attributes are defined in manifest.konnector'
}

const hasFieldsInManifest = {
  fn: (info, assert) => {
    const fields = info.manifest && info.manifest.fields
    const oldFormat = fields && fields.account && fields.account.accountFormat
    assert(!oldFormat, 'The fields should not be in old format')
    return Boolean(fields)
  },
  nickname: 'fields',
  message: 'Fields (necessary for login) are defined in manifest.konnector'
}

const travisUsedToBuildAndDeploy = {
  fn: (info, assert) => {
    let travis
    try {
      travis = yaml.safeLoad(info.read('.travis.yml'))
      if (!travis.deploy || travis.deploy.length !== 3) {
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
      travis.deploy[0].script.match(/DEPLOY_BRANCH=build/),
      'Master should be deployed to build branch'
    )
    assert(
      travis.deploy[0].script.match(/cozyPublish/),
      'Master should be deployed to the registry'
    )
    assert(
      travis.deploy[1].on.branch == 'prod',
      'Second deployment target should be on branch prod'
    )
    assert(
      travis.deploy[1].script.match(/DEPLOY_BRANCH=latest/),
      'Prod should be deployed to latest branch'
    )
    assert(
      travis.deploy[2].on.tags == true,
      'Third deployment target should be on tags'
    )
    assert(
      travis.deploy[2].script.match(/DEPLOY_BRANCH=build/),
      'Tags should be deployed to build branch'
    )
    assert(
      travis.deploy[2].script.match(/cozyPublish/),
      'Tags should be deployed to the registry'
    )
    return true
  },
  nickname: 'travis',
  message: 'Travis is correctly configured to deploy master to the registry',
  link: 'https://github.com/konnectors/docs/blob/master/status.md#auto-build'
}

const renovateIsConfigured = {
  fn: (info, assert) => {
    const renovate =
      JSON.parse(info.read('renovate.json')) || (info.pkg && info.pkg.renovate)
    assert(
      renovate,
      'Renovate should be configured in renovate.json or in package.json'
    )
    assert(
      renovate && renovate.extends.indexOf('cozy-konnector') > -1,
      'Renovate config should extend from the cozy-konnector config'
    )
    return true
  },
  nickname: 'renovate',
  message: 'Renovate should be correctly configured.',
  link: 'https://github.com/konnectors/docs/blob/master/status.md#renovate'
}

const strip = str => str.replace(/^\s+/, '').replace(/\s+$/, '')

const execAsPromise = (cmd, options) => {
  return new Promise((resolve, reject) => {
    exec(cmd, options, (err, stdout) => {
      if (err) {
        reject(err)
      } else {
        resolve(stdout)
      }
    })
  })
}

const getOriginalRemote = async repository => {
  const workingDir = path.join(process.cwd(), repository)
  const remotes = (await execAsPromise('git remote -v', {
    cwd: workingDir
  })).split('\n')
  const originals = remotes.filter(
    x => x.indexOf('git@github.com:konnectors/') > -1
  )
  if (originals.length === 0) {
    return 'origin'
  }
  const originalRemote = originals[0].split('\t')[0]
  return originalRemote
}

const prepareGitInfo = async repository => {
  const workingDir = path.join(process.cwd(), repository)
  let res
  try {
    await execAsPromise('git fetch', {
      cwd: workingDir
    })
    res = await execAsPromise('git branch -r', {
      cwd: workingDir
    })
  } catch (e) {
    res = {}
  }
  const branches = res
    ? res
        .toString()
        .split('\n')
        .map(line => strip(line))
    : []
  return {
    branches: branches,
    remote: await getOriginalRemote(repository)
  }
}

const mkAssert = res => (assertion, warning) => {
  if (!assertion) {
    res.warnings.push(warning)
  }
}

const prepareInfo = async repository => {
  const read = fp => {
    try {
      return fs.readFileSync(path.join(repository, fp))
    } catch (e) {
      throw new Error(`${fp} file is missing`)
    }
  }
  const readJSON = fp => {
    const fileContent = read(fp)
    try {
      return JSON.parse(fileContent)
    } catch (e) {
      throw new Error(`${fp} file malformed`)
    }
  }
  const pkg = readJSON('package.json')
  const manifest = readJSON('manifest.konnector')

  return {
    pkg,
    manifest,
    git: await prepareGitInfo(repository),
    read
  }
}

const checks = [
  lintedByEslintPrettier,
  hasFieldsInManifest,
  mandatoryFieldsInManifest,
  travisUsedToBuildAndDeploy,
  renovateIsConfigured
]

const trueIfUndefined = res => res === undefined || res

class BufferLogger {
  constructor() {
    this.logs = []
  }
  log(...args) {
    this.logs.push(['debug', ...args])
  }
  warn(...args) {
    this.logs.push(['warn', ...args])
  }
  info(...args) {
    this.logs.push(['info', ...args])
  }
  flush() {
    for (let msg of this.logs) {
      console[msg[0] == 'debug' ? 'log' : msg[0]].apply(console, msg.slice(1))
    }
    this.logs.splice(0, this.logs.length) // empty the logs
  }
}

const checkRepository = async repository => {
  const logger = new BufferLogger()

  try {
    const info = await prepareInfo(repository)
    logger.log()
    logger.log(`## Checking ${repository}`)
    logger.log()
    for (let check of checks) {
      const res = { warnings: [] }
      const assert = mkAssert(res)
      const ok = trueIfUndefined(await check.fn(info, assert))
      const failed = !ok || res.warnings.length > 0
      logger.log('*', check.message, !failed ? '✅' : '❌')
      if (res.warnings.length > 0) {
        for (let warning of res.warnings) {
          logger.warn('  -', warning, '❌')
        }
      }
      if (failed && check.link) {
        logger.log('  Check the documentation: ', check.link)
      }
      info.warnings = []

      if (check !== checks[checks.length - 1]) {
        logger.log()
      }
    }
    logger.flush()
    return 0
  } catch (err) {
    logger.warn(err.message)
    logger.flush()
    return 1
  }
}

const checkRepositories = async repositories => {
  let result = 0
  for (let repository of repositories) {
    try {
      const check = await checkRepository(repository)
      if (check > 0) {
        result = check
      }
    } catch (e) {
      console.warn(e)
    }
  }
  return result
}

export default function(options) {
  return checkRepositories(options.repositories)
}
