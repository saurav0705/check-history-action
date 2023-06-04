export type InputObjectType = {
  key: string
  filesRegex: string
}

const parser = (input: string): InputObjectType[] => {
  return input
    .trim()
    .split('\n')
    .map(item => {
      const [key, filesRegex] = item.split(',').map(i => i.trim())
      return {
        key,
        filesRegex
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
