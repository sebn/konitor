import CLI from 'clui'
import { spawn } from 'child_process'
import { getKonnectorPath, getKonnectorField, setKonnectorField } from './helpers/config'
import { hasCmd, launchCmd } from './helpers/package'
import { getFields, getSlug } from './helpers/manifest'
import { askKonnectorField } from './questions'

export const testKonnector = async (repoName) => {
  const path = await getKonnectorPath(repoName)

  await launchCmd(path, ['install'], `Install dependencies of ${repoName}, please wait...`)
  console.log(` - ✅  dependencies is installed.`)

  const hasCleanCmd = await hasCmd(path, 'clean')
  if (hasCleanCmd) {
    await launchCmd(path, ['clean'], `Clean repository, please wait...`)
    console.log(` - ✅  repository is clean.`)
  }

  const fields = getFields(path)
  const slug = getSlug(path)
  for (const field of fields) {
    if (!getKonnectorField(slug, field)) {
      const value = await askKonnectorField(slug, field)
      setKonnectorField(slug, field, value)
    }
  }

  // get fields from https://raw.githubusercontent.com/cozy/cozy-collect/master/src/config/konnectors.json
  // check fields
  // ask fields if is not here
  // launch yarn standalone
  // test if pdf
}
