import clear from 'clear'
import chalk from 'chalk'
import figlet from 'figlet'
import { version } from '../../package.json'

export const displayLogo = () => {
  clear()
  console.log(
    chalk.yellow(figlet.textSync('konitor', { horizontalLayout: 'full' }))
  )
  console.log(` v${version}\n`)
}
