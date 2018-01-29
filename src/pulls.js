import CLI from 'clui'
import { pull as gitPull } from './helpers/git'

export const pulls = async (konnectors) => {
  for (const k of konnectors) {
    const result = await pull(k)
    console.log(` - ✅  ${k.repoName}: ${JSON.stringify(result.summary)}`)
  }
}

export const pull = async (konnector) => {
  const { url, repoName, path } = konnector

  const Spinner = CLI.Spinner
  const status = new Spinner(
    `Pull last change from ${repoName}, please wait...`
  )
  status.start()

  const result = await gitPull(path, url)

  status.stop()

  return result
}
