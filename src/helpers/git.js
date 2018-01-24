import simpleGit from 'simple-git/promise'
import fs from 'fs-extra'

export const pull = async (path, url) => {
  await fs.ensureDir(path)
  const git = simpleGit(path)

  const isRepo = await git.checkIsRepo()
  if (!isRepo) {
    await git.init()
    await git.addRemote('origin', url)
  }

  return await git.pull('origin', 'master', '--rebase=true')
}
