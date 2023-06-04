import {Octokit} from 'octokit'
import {context} from '@actions/github'
import core from '@actions/core'

const GIT_TOKEN = core.getInput('GIT_TOKEN')

export const github = new Octokit({auth: GIT_TOKEN})

export const GITHUB_CONFIG = {
  repo: context.repo.repo ?? '',
  owner: context.repo.owner ?? '',
  issue_number: context.payload.number ?? 0,
  sha: context.sha ?? ''
}
