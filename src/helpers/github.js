import inquirer from 'inquirer'
import CLI from 'clui'
import octokit from '@octokit/rest'
import { getGithubToken as getToken, setGithubToken } from './config'

const github = octokit()

export const getGithubCredentials = async () => {
  const questions = [
    {
      name: 'username',
      type: 'input',
      message: 'Enter your Github username or e-mail address:',
      validate: login => {
        if (login.length) {
          return true
        } else {
          return 'Please enter your username or e-mail address'
        }
      }
    },
    {
      name: 'password',
      type: 'password',
      message: 'Enter your password:',
      validate: password => {
        if (password.length) {
          return true
        } else {
          return 'Please enter your password'
        }
      }
    }
  ]

  return inquirer.prompt(questions)
}

export const getGithubToken = async () => {
  const config = getToken()

  if (config) {
    return config
  }

  const credentials = await getGithubCredentials()

  const Spinner = CLI.Spinner
  const status = new Spinner('Authenticating you, please wait...')
  status.start()

  github.authenticate({ type: 'basic', ...credentials })
  try {
    const result = await github.authorization.create({
      scopes: ['user', 'public_repo', 'repo', 'repo:status'],
      note: 'konitor, the command-line tool for monitoring konnectors',
      note_url: 'https://github.com/konnectors/konitor'
    })
    status.stop()

    const token = result.data && result.data.token
    if (token) {
      setGithubToken(token)
      return token
    }
  } catch (e) {
    status.stop()

    const message = JSON.parse(e.message)

    if (message.message === 'Bad credentials') {
      console.log('##')
      console.warn(` ⚠️  ${message.message}`)
      console.log()

      return getGithubToken()
    } else if (
      message.errors &&
      message.errors.length > 0 &&
      message.errors[0].code === 'already_exists'
    ) {
      throw new Error(
        `Token is already exists, you can remove it: https://github.com/settings/tokens`
      )
    } else {
      throw new Error(message.message)
    }
  }
}
