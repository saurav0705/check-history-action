import fs from 'fs'
import AdmZip from 'adm-zip'
import yml from 'js-yaml'

const checkForFile = (input: string): string => {
  if (fs.existsSync(input)) {
    return fs.readFileSync(input, 'utf-8').toString()
  }
  return input
}

export const convertFileToString = (filePath: string): string | null => {
  try {
    return fs.readFileSync(filePath).toString()
  } catch (e) {
    console.error(
      `Something went wrong while reading the file present at ${filePath} :: ${e}`
    )
    return null
  }
}

export const convertStringToFile = (
  filename: string,
  content: string
): void => {
  try {
    console.log(`Writing file ${filename} with ${content}`)
    fs.writeFileSync(filename, content)
  } catch (e) {
    console.error(`Error writing file with ${filename}`)
    console.error(e)
  }
}

export function arrayBufferToFile(
  arrayBuffer: ArrayBuffer,
  fileName: string
): void {
  const buffer = Buffer.from(arrayBuffer)
  fs.writeFileSync(fileName, buffer)
}

export function extractFileFromZip(
  zipFilePath: string,
  fileName: string,
  destinationPath: string
): void {
  const zip = new AdmZip(zipFilePath)

  const zipEntries = zip.getEntries()
  const entry = zipEntries.find(
    (zipEntry: AdmZip.IZipEntry) => zipEntry.entryName === fileName
  )

  if (entry) {
    const extractedFilePath = `${destinationPath}/${entry.entryName}`
    zip.extractEntryTo(entry, destinationPath, false, true)

    console.log(`File '${fileName}' extracted to '${extractedFilePath}'.`)
  } else {
    console.log(`File '${fileName}' not found in the zip.`)
  }
}

export const checkForNumber = (value: string, fallback = 30): number => {
  if (value?.length) {
    return parseInt(value, 10)
  }
  return fallback
}

export const checkForBoolean = (value: string, fallback = false): boolean => {
  if (value?.length) {
    return value === 'true'
  }
  return fallback
}

export const checkForFileOrLoadYml = (input: string): Record<string, any> => {
  return yml.load(checkForFile(input)) as Record<string, any>
}
