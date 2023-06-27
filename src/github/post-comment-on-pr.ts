import {github} from './client'

export const postCommentOnPR = async (
  body: string
): Promise<{commentId: null | number}> => {
  try {
    const data = await github.client.rest.issues.createComment({
      ...github.getRequestConfig(),
      issue_number: github.CONFIG.issue_number,
      body
    })
    console.log(JSON.stringify(data, null, 2))
    return {commentId: data.data.id}
  } catch (e) {
    console.error(`Error while posting comment on PR : `, e)
    return {commentId: null}
  }
}

export const deleteCommentOnPR = async (commentId: number): Promise<void> => {
  try {
    await github.client.rest.issues.deleteComment({
      ...github.getRequestConfig(),
      comment_id: commentId
    })
  } catch (e) {
    console.error(`Error while posting comment on PR : `, e)
  }
}
