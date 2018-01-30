import clear from "clear"
import chalk from "chalk"
import figlet from "figlet"

export const displayLogo = () => {
  clear()
  console.log(
    chalk.yellow(figlet.textSync("konitor", { horizontalLayout: "full" }))
  )
}
