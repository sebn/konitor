// simple-git supposes that git is in english or else won't work
process.env.LANG = "en"

import yargs from "yargs"
import { isAbsolute, resolve } from "path"
import { version } from "../package.json"
import { displayLogo } from "./helpers/logo"
import { interactive } from "./interactive"
import { pulls } from "./pulls"
import { testKonnector } from "./test"
import { getKonnector, getKonnectorFromPath, getKonnectors } from "./list"

displayLogo()

yargs
  .version()
  .usage("Usage: $0 <command> [options]")
  .command({
    command: "pulls",
    desc: "Pull all konnectors",
    handler: async () => {
      console.log(`\nPull all konnectors:\n`)
      const konnectors = await getKonnectors()
      await pulls(konnectors)
      console.log()
    }
  })
  .command({
    command: "test <name>",
    desc: "Test a konnector",
    handler: async ({ name }) => {
      console.log(`\nTest konnector ${name}:\n`)
      const konnector = await getKonnector(name)
      await testKonnector(konnector)
      console.log()
    }
  })
  .command({
    command: "testit <path>",
    desc: "Test from a konnector",
    handler: async ({ path }) => {
      if (!isAbsolute(path)) {
        path = resolve(process.cwd(), path)
      }
      const konnector = await getKonnectorFromPath(path)
      console.log(`\nTest konnector ${konnector.slug}:\n`)
      await testKonnector(konnector)
      console.log()
    }
  })
  .command({
    command: "interactive",
    aliases: ["$0"],
    desc: "Launch interactive mode",
    handler: async () => {
      await interactive()
    }
  })
  .locale("en").argv
