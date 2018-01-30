import inquirer from "inquirer"
import { find } from "lodash"

const name = "name"

export const selectKonnector = async konnectors => {
  const message = "Which konnector do you want to test?"
  const question = {
    type: "list",
    name,
    message,
    choices: konnectors.map(k => (k.slug === undefined ? k.repoName : k.slug))
  }
  const answer = (await inquirer.prompt(question))[name]
  console.log()

  return find(konnectors, k => k.slug === answer || k.repoName === answer)
}

export const askKonnectorField = async (slug, field) => {
  const message = `What's '${field}' for konnector '${slug}'?`
  const question = {
    type: field === "password" ? "password" : "input",
    name,
    message
  }
  const answer = (await inquirer.prompt(question))[name]

  return answer
}
