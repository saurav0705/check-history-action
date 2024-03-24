import {artifact} from './artifact'
import {TComment} from './get-config'
import {github} from './github/client'
import {deleteCommentOnPR, postCommentOnPR} from './github/post-comments'
import {ArtifactFinalResponseStatus} from './regex-match-for-files'

const generateCommitRunUrl = (sha: string | null): string => {
  if (!sha) {
    return `https://github.com/${github.CONFIG.owner}/${github.CONFIG.repo}/pull/${github.CONFIG.issue_number}/checks`
  }
  return `https://github.com/${github.CONFIG.owner}/${github.CONFIG.repo}/pull/${github.CONFIG.issue_number}/checks?sha=${sha}`
}

const makeSummaryForItem = (item: ArtifactFinalResponseStatus): string => {
  if (item.disableInComment) {
    return ''
  }

  return `<details>
  <summary><h3>${item.suppliedKey}<code>${
    item.shouldRun
  }</code></h3></summary>\n
  - Last Successfully Run Commit: [${item.sha}](${generateCommitRunUrl(
    item.sha
  )})\n
  - Pattern: \`${item.filesRegex}\`\n
  - Status: \`${item.shouldRun}\`\n
  ${item.diffUrl ? `- Diff Url: ${item.diffUrl}` : ''}
  ${item.diffFiles ? '- Diff Files:\n' : ''}
	${item.diffFiles?.map(file => `\`${file}\``).join('\n') ?? ''}
</details>
`
}

const deleteOldComment = async (): Promise<void> => {
  const commentId = await artifact.downloadArtifact('pr-comment')
  if (commentId) {
    deleteCommentOnPR(parseInt(commentId, 10))
  }
}

const createNewComment = async (
  body: string,
  commentRetentionDays: number
): Promise<void> => {
  const data = await postCommentOnPR(body)
  if (data) {
    artifact.uploadArtifact(
      'pr-comment',
      data.commentId?.toString() ?? '',
      commentRetentionDays
    )
  }
}

export const postCommentOnPrWithDetails = async (
  artifacts: ArtifactFinalResponseStatus[],
  config: TComment
): Promise<void> => {
  if (config.disable) {
    return
  }

  const body = `# History Action Summary\n${artifacts
    .map(makeSummaryForItem)
    .join('\n')}`
  await deleteOldComment()
  await createNewComment(body, config.artifactRetentionDays)
}
