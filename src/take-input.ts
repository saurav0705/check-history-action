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
  shards?: string
}

const parser = (input: string): InputObjectType[] => {
  const config = yml.load(input) as InputYaml[]

  return config
    .map(item => {
      let count = 0
      try {
        if (item.shards && !isNaN(parseInt(item.shards, 10))) {
          count = parseInt(item.shards ?? '0', 10)
        }
      } catch (e) {
        console.error('Error Happened', e)
      }

      return count
        ? [
            {
              key: `${item.key}-${github.CONFIG.issue_number}`,
              filesRegex: item.pattern,
              suppliedKey: item.key
            }
          ]
        : Array(count)
            .fill({
              key: `${item.key}-${github.CONFIG.issue_number}`,
              filesRegex: item.pattern,
              suppliedKey: item.key
            })
            .map((_item, index) => ({
              ..._item,
              key: `${item.key}-${index + 1}-${github.CONFIG.issue_number}`
            }))
    })
    .flat()
}

export const getArtifactInputs = (
  input: string
): {artifacts: InputObjectType[]} => {
  return {
    artifacts: parser(input)
  }
}
