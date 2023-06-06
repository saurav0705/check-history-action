import {github} from './client'

type DiffFilesType = {
  base: string
  head: string
}

export type ReturnTypeOfDiffFiles = {
  url: string
  files: string[]
}

export const getFileDiffFromGithub = async ({
  base,
  head
}: DiffFilesType): Promise<ReturnTypeOfDiffFiles> => {
  console.log(`fetching file diff for ${base} ${head}`)
  const resp = await github.client.rest.repos.compareCommits({
    base,
    head,
    ...github.CONFIG
  })

  return {
    files: resp.data.files?.map(item => item.filename) ?? [],
    url: resp.data.html_url
  }
}
