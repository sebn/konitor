import clear from 'clear'
import chalk from 'chalk'
import figlet from 'figlet'

import { getGithubToken } from './github'
import { getGithubRepositories, displayRepositories } from './list'

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
  } catch (e) {
    console.log()
    console.warn(` ⚠️  ${e.message || e}`)
    console.log()
  }
}

main()
