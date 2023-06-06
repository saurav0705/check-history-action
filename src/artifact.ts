import {ArtifactClient, create} from '@actions/artifact'
import {
  arrayBufferToFile,
  convertFileToString,
  convertStringToFile,
  extractFileFromZip
} from './utils'
import {
  getArtifactsByName,
  deleteArtifacts,
  downloadArtifact
} from './github/artifacts'
import {github} from './github/client'

class ArtifactHandler {
  client = create()

  setClient(client: ArtifactClient): void {
    this.client = client
  }

  private generateArtifactName(name: string): string {
    return `check-action-history-${github.CONFIG.owner}-${github.CONFIG.repo}-${name}-${github.CONFIG.issue_number}`
  }

  async uploadArtifact(name: string, value: string): Promise<void> {
    const ARTIFACT_NAME = this.generateArtifactName(name)
    // Get All Artifacts by Old Name
    const artifacts = await getArtifactsByName(`${ARTIFACT_NAME}.txt`)

    // Delete All Old Artifacts By Same Name
    await deleteArtifacts(artifacts)

    // Upload New Artifact
    convertStringToFile(`${ARTIFACT_NAME}.txt`, value)
    this.client.uploadArtifact(ARTIFACT_NAME, [`${ARTIFACT_NAME}.txt`], '.', {})
  }

  async downloadArtifact(name: string): Promise<string | null> {
    try {
      const ARTIFACT_NAME = this.generateArtifactName(name)
      console.log(`Fetching artifact ${name} with key :: ${ARTIFACT_NAME}`)
      const resp = await downloadArtifact(ARTIFACT_NAME)

      if (!resp) {
        return null
      }

      arrayBufferToFile(resp, `${ARTIFACT_NAME}.zip`)
      extractFileFromZip(`${ARTIFACT_NAME}.zip`, `${ARTIFACT_NAME}.txt`, './')
      return convertFileToString(`${ARTIFACT_NAME}.txt`)
    } catch (e) {
      console.error(`Error while downloading artifact ${name}`, e)
      return null
    }
  }
}

export const artifact = new ArtifactHandler()
