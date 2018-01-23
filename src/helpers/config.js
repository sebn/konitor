import Configstore from 'configstore'
import { dirname } from 'path'
import fs from 'fs-extra'

import { name } from '../../package.json'

const conf = new Configstore(name)

export const getConfigPath = async () => {
  const filePath = conf.path
  const dir = dirname(filePath) + '/' + name
  await fs.ensureDir(dir)

  return dir
}

export const getGithubToken = () => {
  return conf.get('github.token')
}

export const setGithubToken = token => {
  conf.set('github.token', token)
}

export const getKonnectorLibsVersion = async (dir) => {
  const configPath = await getConfigPath()
  const pkg = require(`${configPath}/${dir}/package.json`)

  return pkg.dependencies['cozy-konnectors-libs']
}
