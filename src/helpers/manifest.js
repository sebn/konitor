import fs from 'fs-extra'

export const getManifest = async (path) => {
  const manifest = await fs.readJson(`${path}/manifest.konnector`)

  return manifest
}

export const getFields = async (path) => {
  const manifest = await getManifest(path)

  return manifest.fields
    && manifest.fields.account
    && manifest.fields.account.accountFormat
    && manifest.fields.account.accountFormat.split(',')
}

export const getSlug = async (path) => {
  const manifest = await getManifest(path)

  return manifest.slug
}
