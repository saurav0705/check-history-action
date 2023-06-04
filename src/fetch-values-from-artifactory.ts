import artifact from '@actions/artifact'
import {convertFileToString} from './utils'
import {InputObjectType} from './take-input'
const client = artifact.create()

export type ArtifactResponseType = InputObjectType & {
  sha: null | string
}

export const getAllArtifactValues = async (
  artifacts: InputObjectType[]
): Promise<ArtifactResponseType[]> => {
  const resp: ArtifactResponseType[] = []

  for (const _artifact of artifacts) {
    try {
      console.log(`Fetching artifact : ${_artifact}....`)
      const value = await client.downloadArtifact(_artifact.key)
      resp.push({
        ..._artifact,
        sha: convertFileToString(value.downloadPath)
      })
    } catch (e) {
      console.error(`Error in fetching ${_artifact} :: ${e}`)
      resp.push({
        ..._artifact,
        sha: null
      })
    }
  }
  return resp
}
