import {postCommentOnPR} from './github/post-comment-on-pr'
import {ArtifactFinalResponseStatus} from './regex-match-for-files'

export const postCommentOnPrWithDetails = async (
  artifacts: ArtifactFinalResponseStatus[]
): Promise<void> => {
  const body = artifacts.reduce((prev, artifact) => {
    return `${prev} \n ${artifact.suppliedKey} | ${artifact.filesRegex} | ${
      artifact.sha
    } | ${artifact.diffFiles?.join(',<br/>')} | ${artifact.shouldRun}`
  }, 'Key | Pattern | SHA | Changed Files | Status\n --------- | --------- |--------- |--------- |--------- ')
  await postCommentOnPR(body)
}
