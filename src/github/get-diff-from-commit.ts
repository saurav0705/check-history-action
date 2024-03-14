import * as exec from '@actions/exec'
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
  const {exitCode, stdout, stderr} = await exec.getExecOutput(
    'git',
    [
      'diff',
      '--name-only',
      '--ignore-submodules=all',
      `--diff-filter=ACDMRTUX`,
      `${base}..${head}`
    ],
    {
      cwd: '.',
      ignoreReturnCode: true,
      silent: false
    }
  )

  if (exitCode !== 0) {
    throw new Error(
      `Failed to get diff files between ${base}..${head} Exit code: ${exitCode}. Due to error ${stderr}`
    )
  }

  const allFiles = stdout.split('\n').filter(Boolean)

  // Get the html_url from this only
  const resp = await github.client.rest.repos.compareCommits({
    ...github.getRequestConfig(),
    base,
    head
  })

  return {
    files: allFiles,
    url: resp.data.html_url
  }
}
