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

export const getKonnectorPath = async (repoName) => {
  const configPath = await getConfigPath()

  return `${configPath}/${repoName}`
}

export const getGithubToken = () => {
  return conf.get('github.token')
}

export const setGithubToken = token => {
  conf.set('github.token', token)
}

export const setKonnectorField = (repoName, field, value) => {
  conf.set(`konnector.${field}`, value)
}

export const getKonnectorField = (repoName, field) => {
  conf.get(`konnector.${field}`)
}
