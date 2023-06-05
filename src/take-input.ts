import {github} from './github/client'

export type InputObjectType = {
  key: string
  filesRegex: string
  suppliedKey: string
}

const parser = (input: string): InputObjectType[] => {
  return input
    .trim()
    .split('\n')
    .map(item => {
      const [key, filesRegex] = item.split(',').map(i => i.trim())
      return {
        key: `${key}-${github.CONFIG.issue_number}`,
        filesRegex,
        suppliedKey: key
      }
    })
}

export const getArtifactInputs = (
  input: string
): {artifacts: InputObjectType[]} => {
  return {
    artifacts: parser(input)
  }
}
