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
  const base = await exec.getExecOutput('git' , ['fetch', 'origin', base])
  const head = await exec.getExecOutput('git' , ['fetch', 'origin', head])
  const diff = await exec.getExecOutput(
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

  if (!diff.exitCode || !base.exitCode || !head.exitCode) {
    const errors: string[] = []

    if(!diff.exitCode){
        errors.push( `Failed to get diff files between ${base}..${head} Exit code: ${diff.exitCode}. Due to error ${diff.stderr}`)
    }

    if(!base.exitCode){
        errors.push( `Failed to fetch base: ${base} commit Exit code: ${base.exitCode}. Due to error ${base.stderr}`)
    }

    if(!head.exitCode){
        errors.push( `Failed to fetch head: ${head} commit Exit code: ${head.exitCode}. Due to error ${head.stderr}`)
    }

    throw new Error(errors.join("\n"))
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
