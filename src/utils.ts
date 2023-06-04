import fs from 'fs'

export const convertFileToString = (path: string): string | null => {
  try {
    return fs.readFileSync(path).toString()
  } catch (e) {
    console.error(
      `Something went wrong while reading the file present at ${path} :: ${e}`
    )
    return null
  }
}
