import clear from 'clear'
import chalk from 'chalk'
import figlet from 'figlet'

import { getGithubToken } from './github'
import { getGithubRepositories, displayRepositories } from './list'
import { clones } from './git'

const main = async () => {
  clear()
  console.log(
    chalk.yellow(
      figlet.textSync('Monitor', { horizontalLayout: 'full' })
    )
  )

  try {
    const token = await getGithubToken()

    displayRepositories()

    const githubRepositories = getGithubRepositories()

   await clones(githubRepositories)
  } catch (e) {
    console.log()
    console.warn(` ⚠️  ${e.message || e}`)
    console.log()
  }
}

main()
