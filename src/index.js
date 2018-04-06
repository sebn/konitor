import yargs from 'yargs'
import { isAbsolute, resolve } from 'path'
import { version } from '../package.json'
import { displayLogo } from './helpers/logo'
import { interactive } from './interactive'
import { setInteractive } from './helpers/interactive'
import { pulls } from './pulls'
import { testKonnector } from './test'
import { getKonnector, getKonnectorFromPath, getKonnectors } from './list'
import checkGuidelines from './check'

// simple-git supposes that git is in english or else won't work
process.env.LANG = 'en'

yargs // eslint-disable-line no-unused-expressions
  .version(version)
  .usage('Usage: $0 <command> [options]')
  .command({
    command: 'pulls',
    desc: 'Pull all konnectors',
    handler: async () => {
      displayLogo()
      console.log(`Pull all konnectors:\n`)
      const konnectors = await getKonnectors()
      await pulls(konnectors)
      console.log()
    }
  })
  .command({
    command: 'test <name> [options]',
    desc: 'Test a konnector',
    builder: {
      config: {
        alias: 'c',
        default: false,
        description: 'Path to a config file'
      },
      interactive: {
        alias: 'i',
        default: true,
        description: 'Launch interactive mode'
      }
    },
    handler: async ({ name, config, interactive }) => {
      displayLogo()
      setInteractive(interactive)
      console.log(`Test konnector ${name}:\n`)
      const konnector = await getKonnector(name)
      const code = await testKonnector(config, konnector)
      console.log()
      process.exit(code)
    }
  })
  .command({
    command: 'testit <path> [options]',
    desc: 'Test from a konnector',
    builder: {
      config: {
        alias: 'c',
        default: false,
        description: 'Path to a config file'
      },
      interactive: {
        alias: 'i',
        default: true,
        description: 'Launch interactive mode'
      }
    },
    handler: async ({ path, config, interactive }) => {
      displayLogo()
      setInteractive(interactive)
      if (!isAbsolute(path)) {
        path = resolve(process.cwd(), path)
      }
      const konnector = await getKonnectorFromPath(path)
      console.log(`Test konnector ${konnector.slug}:\n`)
      const code = await testKonnector(config, konnector)
      console.log()
      process.exit(code)
    }
  })
  .command({
    command: 'interactive',
    aliases: ['$0'],
    desc: 'Launch interactive mode',
    handler: async () => {
      displayLogo()
      await interactive()
    }
  })
  .command({
    command: 'check <repository>',
    aliases: ['$0'],
    desc: 'Launch interactive mode',
    handler: async options => {
      await checkGuidelines(options)
    }
  })
  .locale('en').argv
