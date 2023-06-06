import {github} from './github/client'
import yml from 'js-yaml'

export type InputObjectType = {
  key: string
  filesRegex: string
  suppliedKey: string
}

type InputYaml = {
  key: string
  pattern: string
}

const parser = (input: string): InputObjectType[] => {
  const config = yml.load(input) as InputYaml[]

  return config.map(item => {
    return {
      key: `${item.key}-${github.CONFIG.issue_number}`,
      filesRegex: item.pattern,
      suppliedKey: item.key
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
