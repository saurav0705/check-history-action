import {
  getInput,
  setOutput,
  setFailed,
  info,
  startGroup,
  endGroup
} from '@actions/core'
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
import {getConfig} from './get-config'
import {getUploadConfig} from './get-upload-config'

const uploadFlow = async (input: string) => {
  startGroup(`Starting Upload Flow...`)
  info(`GITHUB CONFIG => ${JSON.stringify(github.CONFIG, null, 2)}`)
  const {key, retentionDays} = getUploadConfig(input)
  info(
    `Uploading Artifact for ${JSON.stringify({key, retentionDays}, null, 2)}`
  )
  await artifact.uploadArtifact(key, github.CONFIG.sha, retentionDays)
  endGroup()
  return
}

const checkFlow = async (config: string) => {
  startGroup(`Started Check Flow...`)
  info(`GITHUB CONFIG => ${JSON.stringify(github.CONFIG, null, 2)}`)
  const setOutputResponse = (response: ArtifactFinalResponseStatus[]): void => {
    for (const resp of response) {
      setOutput(resp.suppliedKey, resp)
    }
  }

  const {disable, comment, checks} = getConfig(config)
  info(`INPUT CONFIG => ${JSON.stringify({disable, comment, checks}, null, 2)}`)

  endGroup()

  // Get Input from action
  const {artifacts} = getArtifactInputs(checks)

  //If Check is disabled it should return this
  if (disable) {
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

  startGroup(`Fetch SHA and check for diff`)
  // Populate SHA in input
  const artifactsValueWithSha = await getAllArtifactValues(artifacts)

  // Add file diff to each Object
  const artifactValueWithShaAndFileDiff = await getFileDiffForAllArtifacts(
    artifactsValueWithSha
  )

  // Complete Response for action
  const artifactValueWithShaAndFileDiffWithShouldRunStatus =
    matchFileForResponse(artifactValueWithShaAndFileDiff)

  endGroup()

  startGroup(`Posting PR Comment`)
  // post a message summary of action if not disabled
  await postCommentOnPrWithDetails(
    artifactValueWithShaAndFileDiffWithShouldRunStatus,
    comment
  )
  endGroup()

  // set output
  setOutputResponse(artifactValueWithShaAndFileDiffWithShouldRunStatus)
}

async function run(): Promise<void> {
  try {
    const GIT_TOKEN = getInput('GIT_TOKEN')
    const UPLOAD = getInput('UPLOAD')
    github.setClient(GIT_TOKEN)
    github.setConfig({
      repo: context.repo.repo ?? '',
      owner: context.repo.owner ?? '',
      issue_number: context.payload.number ?? 0,
      sha: context.payload.pull_request?.head.sha ?? ''
    })

    if (UPLOAD?.length) {
      await uploadFlow(UPLOAD)
      return
    }

    await checkFlow(getInput('CONFIG'))
  } catch (e) {
    console.error(`Error while executing action :: `, e)
    setFailed((e as Error).message)
  }
}

run()
