import {InputObjectType} from './take-input'
import {artifact} from './artifact'

export type ArtifactResponseType = InputObjectType & {
  sha: null | string
}

export const getAllArtifactValues = async (
  artifacts: InputObjectType[]
): Promise<ArtifactResponseType[]> => {
  const resp: ArtifactResponseType[] = []

  for (const _artifact of artifacts) {
    try {
      console.log(`Fetching artifact : ${_artifact.suppliedKey}....`)
      const value = await artifact.downloadArtifact(_artifact.suppliedKey)
      resp.push({
        ..._artifact,
        sha: value
      })
    } catch (e) {
      console.error(`Error in fetching ${_artifact.key} :: ${e}`)
      resp.push({
        ..._artifact,
        sha: null
      })
    }
  }
  return resp
}
