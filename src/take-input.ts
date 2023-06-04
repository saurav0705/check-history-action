import core from '@actions/core'

const ARTIFACTS = 'artifacts'

export type InputObjectType = {
  key: string
  filesRegex: string
}

export const getInputs = (): {artifacts: InputObjectType[]} => {
  const artifactsToBeFetched = core.getInput(ARTIFACTS)
  return {
    artifacts: JSON.parse(artifactsToBeFetched) as InputObjectType[]
  }
}
