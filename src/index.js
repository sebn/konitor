import clear from 'clear'
import chalk from 'chalk'
import figlet from 'figlet'

import { getGithubCredentials } from './github'

const main = async () => {
  clear()
  console.log(
    chalk.yellow(
      figlet.textSync('Monitor', { horizontalLayout: 'full' })
    )
  )

  const credentials = await getGithubCredentials()
  console.log(credentials)
}

main()
