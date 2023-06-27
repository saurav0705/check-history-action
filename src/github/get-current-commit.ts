import {github} from './client'

export const getLatestCommitFromBranch = async (
  branch: string
): Promise<string> => {
  const resp = await github.client.rest.repos.getCommit({
    ...github.getRequestConfig(),
    ref: branch
  })
  return resp.data.sha
}
