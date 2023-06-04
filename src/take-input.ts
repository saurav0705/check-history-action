import core from '@actions/core'

const ARTIFACTS = 'artifacts'

export type InputObjectType = {
  key: string
  filesRegex: string
}

export const getArtifactInputs = (
  input: string
): {artifacts: InputObjectType[]} => {
  const artifactsToBeFetched = core.getInput(ARTIFACTS)
  return {
    artifacts: JSON.parse(input) as InputObjectType[]
  }
}
