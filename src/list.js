import { getGithubRepositories } from "./helpers/list"
import { getKonnectorPath } from "./helpers/config"
import { getSlug } from "./helpers/manifest"

export const getKonnector = async name => {
  const konnectors = await getKonnectors()
  const konnector = konnectors.find(k => k.slug === name || k.repoName === name)

  return konnector
}

export const getKonnectors = async () => {
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
