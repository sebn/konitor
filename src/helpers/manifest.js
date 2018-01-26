import fs from 'fs-extra'

const loadJSON = (file) => {
    var data = fs.readFileSync(file);
    return JSON.parse(data);
}

export const getManifest = (path) => {
  const manifest = loadJSON(`${path}/manifest.konnector`)

  return manifest
}

export const getFields = (path) => {
  const manifest = getManifest(path)

  return manifest.fields
    && manifest.fields.account
    && manifest.fields.account.accountFormat
    && manifest.fields.account.accountFormat.split(',')
}

export const getSlug = (path) => {
  const manifest = getManifest(path)

  return manifest.slug
}
