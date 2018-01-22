import repos from '../list.json'
import { includes } from 'lodash'
import Table from 'tty-table'

const REPO_REGEXP = /^https?:\/\/([a-zA-Z0-9-_.]+)\/([a-zA-Z0-9-_.]+)\/([a-zA-Z0-9-_.]+)$/
const PROVIDER_GITHUB = 'github.com'
const PROVIDER_GITLAB = 'gitlab.cozycloud.cc'

const parsingRepository = url => {
  const matching = url.match(REPO_REGEXP)
  return {
    provider: matching[1] === PROVIDER_GITHUB ? 'Github' : 'Gitlab',
    owner: matching[2],
    repoName: matching[3],
    url
  }
}

const getRepositories = (provider = '') => {
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

export const displayRepositories = () => {
  const header = [{
    value: 'provider',
    alias: 'Provider',
    align: 'left',
    paddingLeft: 1,
    width: 13
  }, {
    value: 'owner',
    alias: 'Owner',
    align: 'left',
    paddingLeft: 1,
    width: 15
  }, {
    value: 'repoName',
    alias: 'Repo Name',
    align: 'left',
    paddingLeft: 1,
    width: 50
  }]
  const body = getRepositories()
  const t1 = Table(header, body, {
    borderStyle : 1,
    paddingBottom : 0,
    headerAlign : 'center',
    align : 'center',
    color : 'white'
  })

  console.log(t1.render());
}
