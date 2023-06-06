import {github} from './client'

export const getArtifactsByName = async (
  artifactName: string
): Promise<number[]> => {
  try {
    const data = await github.client.rest.actions.listArtifactsForRepo({
      ...github.CONFIG,
      name: artifactName
    })
    return data.data.artifacts.map(art => art.id)
  } catch (e) {
    console.error(`Failed to fetch list of artifacts`, e)
    return []
  }
}

export const deleteArtifacts = async (artifactIds: number[]): Promise<void> => {
  for (const artifact of artifactIds) {
    try {
      await github.client.rest.actions.deleteArtifact({
        ...github.CONFIG,
        artifact_id: artifact
      })
    } catch (e) {
      console.error(`unable to delete artifact with id :: ${artifact}`, e)
    }
  }
}

export const downloadArtifact = async (
  artifactName: string
): Promise<Buffer | null> => {
  console.log('download called  ', artifactName)
  try {
    const artifactId = await getArtifactsByName(artifactName)
    const resp = await github.client.rest.actions.downloadArtifact({
      ...github.CONFIG,
      artifact_id: artifactId[0],
      archive_format: 'zip'
    })

    return resp.data as Buffer
  } catch (e) {
    console.error(`Error in downloading an artifact ${artifactName}`, e)
    return null
  }
}
