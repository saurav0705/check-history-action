import {postCommentOnPR} from './github/post-comment-on-pr'
import {ArtifactFinalResponseStatus} from './regex-match-for-files'

const makeSummaryForItem = (item: ArtifactFinalResponseStatus): string => {
  return `<details>
  <summary><h3>${item.suppliedKey}<code>${
    item.shouldRun
  }</code></h3></summary>\n
  - Last Successfull Run Commit: \`${item.sha}\`\n
  - Pattern: \`${item.filesRegex}\`\n
  - Status: \`${item.shouldRun}\`\n
  ${item.diffUrl ? `- Diff Url: ${item.diffUrl}` : ''}
  ${item.diffFiles ? '- Diff Files:\n' : ''}
	${item.diffFiles?.map(file => `\`${file}\``).join('\n') ?? ''}

</details>`
}

export const postCommentOnPrWithDetails = async (
  artifacts: ArtifactFinalResponseStatus[]
): Promise<void> => {
  const body = `# History Action Summary\n${artifacts
    .map(makeSummaryForItem)
    .join('\n')}`
  await postCommentOnPR(body)
}
