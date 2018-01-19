import inquirer from 'inquirer'

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
