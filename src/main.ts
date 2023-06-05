import {getInput, setOutput, setFailed} from '@actions/core'
import {context} from '@actions/github'

import {
  getAllArtifactValues,
  setArtifactValueVariable
} from './values-from-variables'
import {getFileDiffForAllArtifacts} from './get-diff-files'
import {matchFileForResponse} from './regex-match-for-files'
import {getArtifactInputs} from './take-input'
import {postCommentOnPrWithDetails} from './post-comment-on-pr'

import {github} from './github/client'

const ARTIFACTS = 'KEYS'
async function run(): Promise<void> {
  try {
    const GIT_TOKEN = getInput('GIT_TOKEN')
    const UPLOAD_KEY = getInput('UPLOAD_KEY')

    github.setClient(GIT_TOKEN)
    github.setConfig({
      repo: context.repo.repo ?? '',
      owner: context.repo.owner ?? '',
      issue_number: context.payload.number ?? 0,
      sha: context.sha ?? ''
    })

    if (UPLOAD_KEY) {
      setArtifactValueVariable(`${UPLOAD_KEY}-${github.CONFIG.issue_number}`)
      return
    }

    const artifactsToBeFetched = getInput(ARTIFACTS)
    // Get Input from action
    const {artifacts} = getArtifactInputs(artifactsToBeFetched)
    // Populate SHA in input
    const artifactsValueWithSha = await getAllArtifactValues(artifacts)

    // Add file diff to each Object
    const artifactValueWithShaAndFileDiff = await getFileDiffForAllArtifacts(
      artifactsValueWithSha
    )

    // Complete Response for action
    const artifactValueWithShaAndFileDiffWithShouldRunStatus =
      matchFileForResponse(artifactValueWithShaAndFileDiff)

    // post a message summary of action
    await postCommentOnPrWithDetails(
      artifactValueWithShaAndFileDiffWithShouldRunStatus
    )

    // set output
    for (const resp of artifactValueWithShaAndFileDiffWithShouldRunStatus) {
      setOutput(resp.suppliedKey, resp)
    }
  } catch (e) {
    console.log(e)
    console.error(`Error while executing action ::  ${e}`)
    setFailed((e as Error).message)
  }
}

run()
