import repos from "../../list.json"
import { includes } from "lodash"

const REPO_REGEXP = /^https?:\/\/([a-zA-Z0-9-_.]+)\/([a-zA-Z0-9-_.]+)\/([a-zA-Z0-9-_.]+)$/
const PROVIDER_GITHUB = "github.com"
const PROVIDER_GITLAB = "gitlab.cozycloud.cc"

export const parsingRepository = url => {
  const matching = url.match(REPO_REGEXP)
  return {
    provider: matching[1] === PROVIDER_GITHUB ? "Github" : "Gitlab",
    owner: matching[2],
    repoName: matching[3],
    url
  }
}

export const getRepositories = (provider = "") => {
  const list = []

  for (const repo of repos) {
    if (includes(repo, provider)) {
      list.push(parsingRepository(repo))
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
