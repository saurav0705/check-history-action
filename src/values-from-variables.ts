import {InputObjectType} from './take-input'
import {getGithubVariable, setGithubVariable} from './github/github-variables'
import {github} from './github/client'

const SHA_LOG = 'sha_log'

export type ArtifactResponseType = InputObjectType & {
  sha: null | string
}

export const getAllArtifactValues = async (
  artifacts: InputObjectType[]
): Promise<ArtifactResponseType[]> => {
  const resp: ArtifactResponseType[] = []

  let values: Record<string, string> = {}
  const variable = await getGithubVariable(SHA_LOG)

  if (variable.length) {
    values = JSON.parse(variable) as Record<string, string>
  }

  for (const _artifact of artifacts) {
    try {
      console.log(`Fetching artifact : ${_artifact.key}....`)
      resp.push({
        ..._artifact,
        sha: values[_artifact.key] ?? null
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

export const setArtifactValueVariable = async (key: string): Promise<void> => {
  const values = await getGithubVariable(SHA_LOG)

  if (!values.length) {
    await setGithubVariable(SHA_LOG, {[key]: github.CONFIG.sha})
    return
  }

  await setGithubVariable(SHA_LOG, {
    ...JSON.parse(values),
    [key]: github.CONFIG.sha
  })
}
