import { getGithubRepositories, parsingRepository } from './helpers/list'
import { getKonnectorPath } from './helpers/config'
import { getRepository } from './helpers/package'
import { getSlug } from './helpers/manifest'

export const getKonnectorFromPath = async path => {
  const repository = getRepository(path)
  const konnector = parsingRepository(repository)

  const slug = await getSlug(path)
  konnector.slug = slug
  konnector.path = path

  return konnector
}

export const getKonnector = async name => {
  const konnectors = await getKonnectors()
  const konnector = konnectors.find(k => k.slug === name || k.repoName === name)
  konnector.update = true

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
