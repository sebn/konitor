import repos from '../list.json'
import { includes } from 'lodash'

const PROVIDER_GITHUB = 'github'
const PROVIDER_GITLAB = 'gitlab'

const getRepositories = provider => {
  const list = []

  for (const repo of repos) {
    if (includes(repo, provider)) {
      list.push(repo)
    }
  }

  return list
}

export const getGithubRepositories = () => {
  return getRepositories(PROVIDER_GITHUB)
}

export const getGitlabRepositories = () => {
  return getRepositories(PROVIDER_GITLAB)
}
