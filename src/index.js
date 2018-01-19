import clear from 'clear'
import chalk from 'chalk'
import figlet from 'figlet'

clear()
console.log(
  chalk.yellow(
    figlet.textSync('Monitor', { horizontalLayout: 'full' })
  )
)
