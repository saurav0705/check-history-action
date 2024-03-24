import {TChecks} from './get-config'
import {github} from './github/client'

export type InputObjectType = TChecks & {
  suppliedKey: string
  filesRegex: string[]
}

export const getArtifactInputs = (
  input: TChecks[]
): {artifacts: InputObjectType[]} => {
  return {
    artifacts: input.map(item => {
      return {
        ...item,
        key: `${item.key}-${github.CONFIG.issue_number}`,
        filesRegex: item.pattern,
        suppliedKey: item.key
      }
    })
  }
}
