import CLI from 'clui'
import { spawn } from 'child_process'

const getPackage = (path) => {
  const pkg = require(`${path}/package.json`)

  return pkg
}

const getVersion = async (path) => {
  const pkg = await getPackage(path)

  return pkg.version
}

const getLibVersion = async (path, lib) => {
  const pkg = await getPackage(path)

  return pkg.dependencies[lib] || pkg.devDependencies[lib]
}

export const hasCmd = async (path, cmd) => {
  const pkg = await getPackage(path)

  return !!pkg.scripts[cmd]
}

export const launchCmd = async (path, cmd, spinnerMsg) => {
  return new Promise(async (resolve) => {
    const Spinner = CLI.Spinner
    const status = new Spinner(spinnerMsg)
    status.start()

    const cmd = await spawn('yarn', cmd, { cwd: path, encoding: 'utf8' })

    cmd.on('close', (code) => {
      status.stop()
      resolve()
    })
  })
}
