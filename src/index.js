import yargs from 'yargs'
import { version } from '../package.json'
import { displayLogo } from './helpers/logo'

import { interactive } from './interactive'
import { pulls } from './pulls'
import { testKonnector } from './test'
import { getKonnector, getKonnectors } from './list'

displayLogo()

yargs
  .version()
  .usage('Usage: $0 <command> [options]')
  .command({
    command: 'pulls',
    desc: 'Pull all konnectors',
    handler: async () => {
      console.log(`\nPull all konnectors:\n`)
      const konnectors = await getKonnectors()
      await pulls(konnectors)
      console.log()
    }
  })
  .command({
    command: 'test <name>',
    desc: 'Test a konnector',
    handler: async ({ name }) => {
      console.log(`\nTest konnector ${name}:\n`)
      const konnector = await getKonnector(name)
      await testKonnector(konnector)
      console.log()
    }
  })
  .command({
    command: 'interactive',
    aliases: ['$0'],
    desc: 'Launch interactive mode',
    handler: async () => {
      await interactive()
    }
  })
  .locale('en')
  .argv
