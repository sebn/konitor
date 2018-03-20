import inquirer from 'inquirer'
import { getKonnectors } from './list'
import { pulls } from './pulls'
import { testKonnector } from './test'
import { selectKonnector } from './helpers/questions'

export const interactive = async () => {
  const konnectors = await getKonnectors()
  const name = 'name'
  const message = 'What do you want to do?'

  const aPulls = 'Pull all konnectors'
  const aTest = 'Test a konnector'
  const aQuit = 'Quit'

  const question = {
    type: 'list',
    name,
    message,
    choices: [aTest, aPulls, aQuit]
  }

  let answer
  while (answer !== aQuit) {
    answer = (await inquirer.prompt(question))[name]
    console.log()

    switch (answer) {
      case aPulls:
        await pulls(konnectors)
        break
      case aTest:
        const konnector = await selectKonnector(konnectors)
        await testKonnector(false, konnector)
        break
    }
    console.log()
  }
}
