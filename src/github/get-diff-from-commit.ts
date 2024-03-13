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
}: DiffFilesType, page = 1, allFiles = []): Promise<ReturnTypeOfDiffFiles> => {
  console.log(`fetching file diff for ${base} ${head}`)
  
  const resp = await github.client.rest.repos.compareCommits({
    ...github.getRequestConfig(),
    base,
    head,
    per_page: 250,
    page
  })

  const files = resp.data.files?.map(item => item.filename) ?? [];
  allFiles = allFiles.concat(files);

  // Check if there are more pages to fetch
  if (github.client.hasNextPage(resp)) {
    return getFileDiffFromGithub({ base, head }, page + 1, allFiles);
  }

  return {
    files: allFiles,
    url: resp.data.html_url
  };
}
