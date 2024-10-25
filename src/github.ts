/* istanbul ignore file */
import { context, getOctokit } from '@actions/github'
import {
  defaults as defaultGitHubOptions,
  GitHub
} from '@actions/github/lib/utils'
import { retry } from '@octokit/plugin-retry'
import { githubToken } from './inputs'
import { PullRequestResponse, PullRequestsResponse } from './types'

const RetryAttempts = 3
const ExemptStatusCodes = [400, 401, 403, 404, 422]

const octokit = (): InstanceType<typeof GitHub> =>
  getOctokit(
    githubToken(),
    {
      retry: {
        enabled: true,
        doNotRetry: ExemptStatusCodes
      },
      request: {
        ...defaultGitHubOptions.request,
        retries: RetryAttempts
      }
    },
    retry
  )

export const closedPRsIterator =
  (): AsyncIterableIterator<PullRequestsResponse> =>
    octokit().paginate.iterator('GET /repos/{owner}/{repo}/pulls', {
      ...context.repo,
      state: 'closed',
      per_page: 100
    })

export const getPullRequest = async (
  number: number
): Promise<PullRequestResponse> =>
  octokit().rest.pulls.get({
    ...context.repo,
    pull_number: number
  })
