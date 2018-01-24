import inquirer from 'inquirer'
import { pulls } from './pulls'
import { getRepositories } from './helpers/list'

const selectKonnector = async () => {
  const name = 'selected'
  const repos = getRepositories()
  const question = {
    type: 'list',
    name,
    message: 'Which konnector do you want to test?',
    choices: repos.map(info => info.repoName)
  }
  const answer = (await inquirer.prompt(question))[name]
  console.log()
  console.log(answer)
}

export const starter = async () => {
  const name = 'starter'
  const pull = 'Pull all konnectors'
  const testOne = 'Test a konnector'
  const quit = 'Quit'

  const question = {
    type: 'list',
    name,
    message: 'What do you want to do?',
    choices: [pull, testOne, quit]
  }

  let answer
  while (answer !== quit) {
    console.log()
    answer = (await inquirer.prompt(question))[name]
    console.log()

    switch (answer) {
      case pull:
        await pulls()
        break;
      case testOne:
        await selectKonnector()
        break;
    }
  }
}
