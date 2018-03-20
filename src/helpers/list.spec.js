import { parsingRepository } from './list'

describe('list', () => {
  it('parse a url', () => {
    const url = 'https://github.com/konnectors/konitor'
    expect(parsingRepository(url)).toEqual({
      provider: 'Github',
      owner: 'konnectors',
      repoName: 'konitor',
      url
    })
  })
})
