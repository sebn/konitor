import { getKonnectorField, setKonnectorField } from './helpers/config'
import { hasCmd, launchCmd } from './helpers/package'
import { getFields, getSlug } from './helpers/manifest'
import { getFilesFromDir } from './helpers/filesystem'
import { askKonnectorField } from './helpers/questions'
import { pull } from './pulls'
import fs from 'fs-extra'
import { includes } from 'lodash'

export const testKonnector = async (config, konnector) => {
  const { path, repoName, update } = konnector

  // up to date
  if (update) {
    try {
      await pull(konnector)
      console.log(` - ✅  repository is up to date.`)
    } catch (e) {
      console.log(e)
    }
  }

  // dependencies
  await launchCmd(
    path,
    ['install'],
    `Install dependencies of ${repoName}, please wait...`
  )
  console.log(` - ✅  dependencies is installed.`)

  // clean
  const hasCleanCmd = await hasCmd(path, 'clean')
  if (hasCleanCmd) {
    await launchCmd(path, ['clean'], `Clean repository, please wait...`)
    console.log(` - ✅  repository is clean.`)
  }

  if (config) {
    fs.copyFileSync(config, `${path}/konnector-dev-config.json`)
  } else {
    // create credentials
    const slug = await getSlug(path)
    const fieldsFromManifest = await getFields(path)
    const fields = {}
    for (const field of fieldsFromManifest) {
      let value = getKonnectorField(slug, field)
      if (!value) {
        value = await askKonnectorField(slug, field)
        setKonnectorField(slug, field, value)
      }
      fields[field] = value
    }

    // create file with credentials
    const template = { COZY_URL: 'http://cozy.tools:8080', fields }
    fs.writeFileSync(
      `${path}/konnector-dev-config.json`,
      JSON.stringify(template, null, '  ')
    )
  }

  // Launch standalone test
  const result = await launchCmd(
    path,
    ['standalone'],
    `Launch test, please wait...`
  )

  // Test
  if (result.code === 0) {
    console.log(` - ✅  Correctly executed.`)
  } else {
    console.log(` - ⚠️  Finished with error.`)
  }
  if (includes(result.stdout.join(', '), 'Correctly logged in')) {
    console.log(` - ✅  Correctly logged in.`)
  } else {
    console.log(` - ⚠️  Login failed.`)
  }
  const files = await getFilesFromDir(path, 'PDF')
  if (files.length > 0) {
    console.log(` - ✅  PDF is imported.`)
  } else {
    console.log(` - ⚠️  No PDF.`)
  }

  // clean
  if (hasCleanCmd) {
    await launchCmd(path, ['clean'], `Clean repository, please wait...`)
    console.log(` - ✅  repository is clean.`)
  }

  return result.code
}
