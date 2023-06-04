// import axios from 'axios'
import {github} from './client'

export const setGithubVariable = async <T extends {}>(
  name: string,
  value: T
): Promise<void> => {
  try {
    console.log(
      `Setting Variable with ${name} with value ${JSON.stringify(value)}`
    )
    // await axios.patch(
    //   `https://api.github.com/repos/${github.CONFIG.owner}/${github.CONFIG.repo}/actions/variables/${name}`,
    //   {
    //     name,
    //     value: JSON.stringify(value)
    //   },
    //   {
    //     headers: {
    //       Accept: 'application/vnd.github+json',
    //       Authorization: `Bearer ${github.getToken()}`,
    //       'X-GitHub-Api-Version': '2022-11-28'
    //     }
    //   }
    // )
    await github.client.rest.actions.updateRepoVariable({
      ...github.CONFIG,
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
      ...github.CONFIG,
      name
    })
    return data.data.value
  } catch (e) {
    console.log(e)
    console.error(`Error While Getting ${name}`)
    return ''
  }
}
