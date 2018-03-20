import fs from 'fs-extra'

export const getFilesFromDir = async (dir, extension) => {
  const dirCont = await fs.readdir(dir)
  console.log('dirCont', dirCont)
  const re = new RegExp(`.*\.(${extension})`, 'ig') // eslint-disable-line no-useless-escape
  const files = dirCont.filter(elm => elm.match(re))

  return files
}
