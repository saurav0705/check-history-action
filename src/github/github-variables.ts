import {github} from './client'

export const setGithubVariable = async <T extends {}>(
  name: string,
  value: T
): Promise<void> => {
  try {
    console.log(
      `Setting Variable with ${name} with value ${JSON.stringify(value)}`
    )
    await github.client.rest.actions.updateRepoVariable({
      ...github.getRequestConfig(),
      name,
      value: JSON.stringify(value)
    })
  } catch (e) {
    console.log(e)
    console.error(
      `Error While Setting ${name} with  value ${JSON.stringify(value)}`
    )
  }
}

export const getGithubVariable = async (name: string): Promise<string> => {
  try {
    console.log(`Getting Variable Value with ${name}`)
    const data = await github.client.rest.actions.getRepoVariable({
      ...github.getRequestConfig(),
      name
    })
    return data.data.value
  } catch (e) {
    console.log(e)
    console.error(`Error While Getting ${name}`)
    return ''
  }
}
