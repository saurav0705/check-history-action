import {ArtifactReponseTypeWithFileDiff} from './get-diff-files'

import picomatch from 'picomatch'

export type ArtifactFinalResponseStatus = ArtifactReponseTypeWithFileDiff & {
  shouldRun: boolean
}

export const matchFile = (files: string[], pattern: string[]): boolean => {
  const isMatch = picomatch(pattern)
  for (const file of files) {
    if (isMatch(file)) {
      return true
    }
  }
  return false
}

export const matchFileForResponse = (
  artifacts: ArtifactReponseTypeWithFileDiff[]
): ArtifactFinalResponseStatus[] => {
  return artifacts.map(artifact => ({
    ...artifact,
    shouldRun:
      artifact.diffFiles && !artifact.disable
        ? matchFile(artifact.diffFiles, artifact.filesRegex)
        : true
  }))
}
