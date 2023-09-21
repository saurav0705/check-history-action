import {ArtifactReponseTypeWithFileDiff} from './get-diff-files'

import picomatch from 'picomatch'

export type ArtifactFinalResponseStatus = ArtifactReponseTypeWithFileDiff & {
  shouldRun: boolean
}

export const matchFile = (files: string[], pattern: string): boolean => {
  if (files.length > 290) {
    return true
  }
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
    shouldRun: artifact.diffFiles
      ? matchFile(artifact.diffFiles, artifact.filesRegex)
      : true
  }))
}
