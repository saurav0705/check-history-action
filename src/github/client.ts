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
  private token = ''
  client = new Octokit({auth: ''})

  setConfig(config: GithubConfigType): void {
    this.CONFIG = config
  }

  setClient(token: string): void {
    this.client = new Octokit({auth: token})
    this.token = token
  }

  getToken(): string {
    return this.token
  }

  getRequestConfig(): {owner: string; repo: string} {
    return {
      owner: this.CONFIG.owner,
      repo: this.CONFIG.repo
    }
  }
}

export const github = new GithubClient()
