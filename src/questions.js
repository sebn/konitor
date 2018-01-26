import inquirer from 'inquirer'
import { pulls } from './pulls'
import { getRepositories } from './helpers/list'
import { testKonnector } from './test'

const name = 'name'

const selectKonnector = async () => {
  const message = 'Which konnector do you want to test?'
  const question = {
    type: 'list', name, message,
    choices: getRepositories().map(info => info.repoName)
  }
  const answer = (await inquirer.prompt(question))[name]
  console.log()

  return answer
}

export const askKonnectorField = async (slug, field) => {
  const message = `What's '${field}' for konnector '${slug}'?`
  const question = {
    type: field === 'password' ? 'password' : 'input',
    name, message,
    choices: getRepositories().map(info => info.repoName)
  }
  const answer = (await inquirer.prompt(question))[name]

  return answer
}

export const starter = async () => {
  const message = 'What do you want to do?'
  const aPulls = 'Pull all konnectors'
  const aTest = 'Test a konnector'
  const aQuit = 'Quit'

  const question = {
    type: 'list', name, message,
    choices: [aTest, aPulls, aQuit]
  }

  let answer
  while (answer !== aQuit) {
    console.log()
    answer = (await inquirer.prompt(question))[name]
    console.log()

    switch (answer) {
      case aPulls:
        await pulls()
        break;
      case aTest:
        const konnector = await selectKonnector()
        await testKonnector(konnector)
        break;
    }
  }
}
