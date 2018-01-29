import clear from 'clear'
import chalk from 'chalk'
import figlet from 'figlet'
import inquirer from 'inquirer'

import { pulls } from './pulls'
import { testKonnector } from './test'

import { getKonnectorPath } from './helpers/config'
import { getSlug } from './helpers/manifest'
import { getGithubRepositories } from './helpers/list'

const starter = async (konnectors) => {
  const name = 'name'
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
        await pulls(konnectors)
        break;
      case aTest:
        await testKonnector(konnectors)
        break;
    }
  }
}

const getKonnectors = async () => {
  const konnectors = await getGithubRepositories()

  for (const konnector of konnectors) {
    const path = await getKonnectorPath(konnector.repoName)
    konnector.path = path
    try {
      const slug = await getSlug(path)
      konnector.slug = slug
    } catch (e) {
      // this project are not yet downloaded
    }
  }

  return konnectors
}

const main = async () => {
  clear()
  console.log(
    chalk.yellow(
      figlet.textSync('Monitor', { horizontalLayout: 'full' })
    )
  )

  const konnectors = await getKonnectors()

  try {
    await starter(konnectors)
  } catch (e) {
    console.log()
    console.warn(` ⚠️  ${e.message || e}`)
    console.log()
  }
}

main()
