import path from 'path'
import fs from 'fs'
import yaml from 'js-yaml'
import { exec } from 'child_process'

const lintedByEslintPrettier = {
  fn: (info, assert) => {
    const eslintConfig = info.pkg && info.pkg.eslintConfig
    assert(
      eslintConfig && eslintConfig.extends.indexOf('prettier') > -1,
      'eslintConfig should extend from prettier'
    )
  },
  message:
    'Eslint with prettier is used to lint the code (check for eslintConfig in package.json)'
}

const hasFieldsInManifest = {
  fn: (info, assert) => {
    const fields = info.manifest && info.manifest.fields
    const oldFormat = fields && fields.account && fields.account.accountFormat
    assert(!oldFormat, 'The fields should not be in old format')
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
    const renovate = JSON.parse(info.read('renovate.json')) || (info.pkg && info.pkg.renovate)
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
    for (let branch of ['master', 'build', 'latest', 'prod']) {
      const fullBranch = info.git.remote + '/' + branch
      assert(
        info.git.branches.indexOf(fullBranch) > -1,
        `Repository should have branch ${branch}`
      )
    }
  },
  message: 'Repository should have 4 branches'
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
      return null
    }
  }
  const pkg = JSON.parse(read('package.json'))
  const manifest = JSON.parse(read('manifest.konnector'))
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
  travisUsedToDeployBuildAndLatest,
  renovateIsConfigured,
  repoShouldHave4Branches
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
  const info = await prepareInfo(repository)
  logger.log(`Checking ${repository}`)
  for (let check of checks) {
    const res = { warnings: [] }
    const assert = mkAssert(res)
    const ok = trueIfUndefined(await check.fn(info, assert))
    logger.log(check.message, ok && res.warnings.length === 0 ? '✅' : '❌')
    if (res.warnings.length > 0) {
      for (let warning of res.warnings) {
        logger.warn(' - ', warning, '❌')
      }
    }
    info.warnings = []
  }
  logger.log()
  logger.flush()
}

const checkRepositories = async repositories => {
  for (let repository of repositories) {
    try {
      checkRepository(repository)
    } catch (e) {
      console.warn(e)
    }
  }
}

export default function(options) {
  checkRepositories(options.repositories)
}
