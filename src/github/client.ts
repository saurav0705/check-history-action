import {Octokit} from 'octokit'

type GithubConfigType = {
  repo: string
  owner: string
  issue_number: number
  sha: string
}

class GithubClient {
  CONFIG: GithubConfigType = {
    repo: '',
    owner: '',
    issue_number: 0,
    sha: ''
  }
  client = new Octokit({auth: ''})

  setConfig(config: GithubConfigType): void {
    this.CONFIG = config
  }

  setClient(token: string): void {
    this.client = new Octokit({auth: token})
  }
}

export const github = new GithubClient()
