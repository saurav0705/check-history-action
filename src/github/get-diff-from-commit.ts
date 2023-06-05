import {github} from './client'

type DiffFilesType = {
  base: string
  head: string
}

export const getFileDiffFromGithub = async ({
  base,
  head
}: DiffFilesType): Promise<string[]> => {
  console.log(`fetching file diff for ${base} ${head}`)
  const resp = await github.client.rest.repos.compareCommits({
    base,
    head,
    ...github.CONFIG
  })
  return resp.data.files?.map(item => item.filename) ?? []
}
