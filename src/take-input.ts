export type InputObjectType = {
  key: string
  filesRegex: string
}

export const getArtifactInputs = (
  input: string
): {artifacts: InputObjectType[]} => {
  return {
    artifacts: JSON.parse(input) as InputObjectType[]
  }
}
