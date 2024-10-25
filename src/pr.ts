import * as core from '@actions/core'
import { closedPRsIterator } from './github'
import { pageLimit, sha } from './inputs'
import { PullRequest } from './types'

export const findMergedPullRequest = async (): Promise<PullRequest | null> => {
  let page = 1
  for await (const response of closedPRsIterator()) {
    core.info(`Processing page ${page} of closed PRs`)
    const foundPr = response.data.find(pr => pr.merge_commit_sha === sha())

    if (foundPr) {
      core.info(
        `Found PR #${foundPr.number} with matching SHA ${sha()} on page ${page}`
      )
      return foundPr
    }

    if (page >= pageLimit()) {
      core.info(`Reached page limit of ${pageLimit()}`)
      break
    }

    page++
  }

  return null
}
