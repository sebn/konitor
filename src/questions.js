import inquirer from 'inquirer'
import { pulls } from './pulls'

export const starter = async () => {
  const name = 'starter'
  const choice1 = 'Pull all konnectors'
  const choice2 = 'Quit'

  const question = {
    type: 'list',
    name,
    message: 'What do you want to do?',
    choices: [choice1, choice2]
  }

  let answer
  while (answer !== choice2) {
    console.log()
    answer = (await inquirer.prompt(question))[name]
    console.log()

    if (answer === choice1) {
      await pulls()
    }
  }
}
