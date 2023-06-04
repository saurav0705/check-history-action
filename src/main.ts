import core, {setFailed} from '@actions/core'
import {context} from '@actions/github'

import {getAllArtifactValues} from './fetch-values-from-artifactory'
import {getFileDiffForAllArtifacts} from './get-diff-files'
import {matchFileForResponse} from './regex-match-for-files'
import {getArtifactInputs} from './take-input'
import {postCommentOnPrWithDetails} from './post-comment-on-pr'

import {github} from './github/client'

const ARTIFACTS = 'artifacts'
async function run(): Promise<void> {
  /**
   * 1. Take Input - DONE
   * 2. Fetch SHA - DONE
   * 3. File Diff - DONE
   * 4. regex match for file diff - DONE
   * 5. comment on pr - DONE
   * 6. output should run
   */

  try {
    const GIT_TOKEN = core.getInput('GIT_TOKEN')
    const artifactsToBeFetched = core.getInput(ARTIFACTS)

    github.setClient(GIT_TOKEN)
    github.setConfig({
      repo: context.repo.repo ?? '',
      owner: context.repo.owner ?? '',
      issue_number: context.payload.number ?? 0,
      sha: context.sha ?? ''
    })
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
    core.setOutput('status', artifactValueWithShaAndFileDiffWithShouldRunStatus)
  } catch (e) {
    console.error(`Error while executing action ::  ${e}`)
    setFailed((e as Error).message)
  }
}

run()
