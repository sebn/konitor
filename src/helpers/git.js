import simpleGit from 'simple-git/promise'
import fs from 'fs-extra'

export const pull = async (dir, url) => {
  await fs.ensureDir(dir)
  const git = simpleGit(dir)

  const isRepo = await git.checkIsRepo()
  if (!isRepo) {
    await git.init()
    await git.addRemote('origin', url)
  }

  return await git.pull('origin', 'master', '--rebase=true')
}
