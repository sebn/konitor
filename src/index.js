import clear from 'clear'
import chalk from 'chalk'
import figlet from 'figlet'

import { starter } from './questions'

const main = async () => {
  clear()
  console.log(
    chalk.yellow(
      figlet.textSync('Monitor', { horizontalLayout: 'full' })
    )
  )

  try {
    await starter()
  } catch (e) {
    console.log()
    console.warn(` ⚠️  ${e.message || e}`)
    console.log()
  }
}

main()
