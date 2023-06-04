import {ArtifactResponseType} from './values-from-variables'
import {github} from './github/client'
import {getFileDiffFromGithub} from './github/get-diff-from-commit'

const hash: Record<string, string[]> = {}

export type ArtifactReponseTypeWithFileDiff = ArtifactResponseType & {
  diffFiles: null | string[]
}

export const getDiffFiles = async (
  prevSha: string,
  currSha: string
): Promise<string[]> => {
  if (!hash[`${prevSha}--${currSha}`]) {
    hash[`${prevSha}--${currSha}`] = await getFileDiffFromGithub({
      base: prevSha,
      head: currSha
    })
  }
  return Promise.resolve(hash[`${prevSha}--${currSha}`])
}

export const getFileDiffForAllArtifacts = async (
  artifacts: ArtifactResponseType[]
): Promise<ArtifactReponseTypeWithFileDiff[]> => {
  const resp: ArtifactReponseTypeWithFileDiff[] = []
  for (const artifact of artifacts) {
    try {
      if (artifact.sha) {
        const diffFiles = await getDiffFiles(artifact.sha, github.CONFIG.sha)
        resp.push({...artifact, diffFiles})
      } else {
        resp.push({...artifact, diffFiles: null})
      }
    } catch (e) {
      console.error(`Error file fetching file diff : ${e}`)
      resp.push({...artifact, diffFiles: null})
    }
  }
  return resp
}
