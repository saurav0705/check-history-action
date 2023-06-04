import {github} from './client'

export const postCommentOnPR = async (body: string): Promise<void> => {
  try {
    await github.client.rest.issues.createComment({...github.CONFIG, body})
  } catch (e) {
    console.error(`Error while posting comment on PR : ${e}`)
  }
}
