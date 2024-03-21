import {getInput, setOutput, setFailed} from '@actions/core'
import {context} from '@actions/github'

import {getAllArtifactValues} from './values-from-variables'
import {getFileDiffForAllArtifacts} from './get-diff-files'
import {
  ArtifactFinalResponseStatus,
  matchFileForResponse
} from './regex-match-for-files'
import {getArtifactInputs} from './take-input'
import {postCommentOnPrWithDetails} from './post-comment-on-pr'

import {github} from './github/client'
import {artifact} from './artifact'

const ARTIFACTS = 'KEYS'
async function run(): Promise<void> {
  try {
    const setOutputResponse = (
      response: ArtifactFinalResponseStatus[]
    ): void => {
      for (const resp of response) {
        setOutput(resp.suppliedKey, resp)
      }
    }

    const GIT_TOKEN = getInput('GIT_TOKEN')
    const UPLOAD_KEY = getInput('UPLOAD_KEY')
    const DISABLE_PR_COMMENT = getInput('DISABLE_PR_COMMENT') === 'true'
    const DISABLE_CHECK = getInput('DISABLE_CHECK') === 'true'

    github.setClient(GIT_TOKEN)
    github.setConfig({
      repo: context.repo.repo ?? '',
      owner: context.repo.owner ?? '',
      issue_number: context.payload.number ?? 0,
      sha: context.sha ?? ''
    })

    if (UPLOAD_KEY) {
      const ARTIFACT_RETENTION_DAYS = getInput('ARTIFACT_RETENTION_DAYS')
        ? parseInt(getInput('RETENTION_DAYS'), 10)
        : 90
      artifact.setRetentionDays(ARTIFACT_RETENTION_DAYS)
      await artifact.uploadArtifact(UPLOAD_KEY, github.CONFIG.sha)
      return
    }

    const artifactsToBeFetched = getInput(ARTIFACTS)
    // Get Input from action
    const {artifacts} = getArtifactInputs(artifactsToBeFetched)

    //If Check is disabled it should return this
    if (DISABLE_CHECK) {
      setOutputResponse(
        artifacts.map(item => ({
          ...item,
          sha: '',
          shouldRun: true,
          diffFiles: [],
          diffUrl: ''
        }))
      )
      return
    }

    // Populate SHA in input
    const artifactsValueWithSha = await getAllArtifactValues(artifacts)

    // Add file diff to each Object
    const artifactValueWithShaAndFileDiff = await getFileDiffForAllArtifacts(
      artifactsValueWithSha
    )

    // Complete Response for action
    const artifactValueWithShaAndFileDiffWithShouldRunStatus =
      matchFileForResponse(artifactValueWithShaAndFileDiff)

    // post a message summary of action if not disabled
    if (!DISABLE_PR_COMMENT) {
      await postCommentOnPrWithDetails(
        artifactValueWithShaAndFileDiffWithShouldRunStatus
      )
    }

    // set output
    setOutputResponse(artifactValueWithShaAndFileDiffWithShouldRunStatus)
  } catch (e) {
    console.error(`Error while executing action :: `, e)
    setFailed((e as Error).message)
  }
}

run()
