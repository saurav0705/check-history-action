import {github} from './client'

export const postCommentOnPR = async (
  body: string
): Promise<{commentId: null | number}> => {
  try {
    const data = await github.client.rest.issues.createComment({
      ...github.CONFIG,
      body
    })
    return {commentId: data.data.id}
  } catch (e) {
    console.error(`Error while posting comment on PR : `, e)
    return {commentId: null}
  }
}

export const deleteCommentOnPR = async (commentId: number): Promise<void> => {
  try {
    await github.client.rest.issues.deleteComment({
      ...github.CONFIG,
      comment_id: commentId
    })
  } catch (e) {
    console.error(`Error while posting comment on PR : `, e)
  }
}
