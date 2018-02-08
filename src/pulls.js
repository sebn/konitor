import CLI from "clui"
import { pull as gitPull } from "./helpers/git"
import { isInteractive } from "./helpers/interactive"

export const pulls = async konnectors => {
  for (const k of konnectors) {
    const result = await pull(k)
    console.log(` - ✅  ${k.repoName}: ${JSON.stringify(result.summary)}`)
  }
}

export const pull = async konnector => {
  const { url, repoName, path } = konnector
  const spinnerMsg = `Pull last change from ${repoName}, please wait...`
  const Spinner = CLI.Spinner
  const status = new Spinner(spinnerMsg)
  if (isInteractive()) {
    status.start()
  } else {
    console.log(` ${spinnerMsg}`)
  }

  let result
  try {
    result = await gitPull(path, url)
  } catch (e) {
    if (isInteractive()) status.stop()
    throw e
  }

  if (isInteractive()) status.stop()

  return result
}
