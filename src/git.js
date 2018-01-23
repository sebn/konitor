import simpleGit from 'simple-git/promise'
import fs from 'fs-extra'
import CLI from 'clui'
import { getConfigPath } from './config'

export const clone = async (info) => {
  const configPath = await getConfigPath()
  const dir = `${configPath}/${info.repoName}`
  await fs.ensureDir(dir)
  const git = simpleGit(dir)

  const isRepo = await git.checkIsRepo()
  if (!isRepo) {
    await git.init()
    await git.addRemote('origin', info.url)
  }

  return await git.fetch()
}

export const clones = async (infos) => {
  const Spinner = CLI.Spinner
  const status = new Spinner('Fetch all repositories, please wait...')
  status.start()

  for (const info of infos) {
    try {
      await clone(info)
    } catch (e) {
      console.log(e)
    }
  }

  status.stop()
}
