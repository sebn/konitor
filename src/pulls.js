import CLI from 'clui'
import { getGithubRepositories } from './helpers/list'
import { pull } from './helpers/git'
import { getKonnectorPath } from './helpers/config'

export const pulls = async () => {
  // TODO: replace by getRepositories() when Gitlab is available
  const repositories = getGithubRepositories()
  for (const { url, repoName } of repositories) {
    const konnectorPath = await getKonnectorPath(repoName)

    const Spinner = CLI.Spinner
    const status = new Spinner(
      `Pull last change from ${repoName}, please wait...`
    )
    status.start()

    const result = await pull(konnectorPath, url)

    status.stop()
    console.log(` - ✅  ${repoName}: ${JSON.stringify(result.summary)}`)
  }
}
