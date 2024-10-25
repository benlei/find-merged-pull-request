import * as inputs from '../src/inputs'
import { findMergedPullRequest } from '../src/pr'
import { PullRequest, PullRequestsResponse } from '../src/types'
import * as github from '../src/github'

const FoundPr: PullRequest = {
  merge_commit_sha: 'abc123',
  number: 42,
  id: 5,
  title: 'foo',
  user: { login: 'octocat' },
  body: 'hello world',
  labels: [{ name: 'bug' }, { name: 'enhancement' }],
  merged_by: { login: 'github' },
  milestone: { title: 'v1.0' }
}

const SecondPagePr: PullRequest = {
  merge_commit_sha: 'jkl012',
  id: 0,
  number: 0,
  title: '',
  user: null,
  body: null,
  labels: [],
  milestone: null
}

// eslint-disable-next-line @typescript-eslint/require-await
async function* asyncIterator(): AsyncIterableIterator<PullRequestsResponse> {
  yield {
    data: [
      {
        merge_commit_sha: 'def456',
        id: 0,
        number: 0,
        title: '',
        user: null,
        body: null,
        labels: [],
        milestone: null
      },
      {
        merge_commit_sha: 'ghi789',
        id: 0,
        number: 0,
        title: '',
        user: null,
        body: null,
        labels: [],
        milestone: null
      },
      { ...FoundPr, merged_by: null }
    ]
  }

  yield {
    data: [SecondPagePr]
  }
}

describe('findMergedPullRequest', () => {
  beforeEach(() => {
    jest.spyOn(inputs, 'sha').mockReturnValue('abc123')
    jest.spyOn(inputs, 'pageLimit').mockReturnValue(3)
  })

  it('finds a merged pull request', async () => {
    jest.spyOn(github, 'closedPRsIterator').mockReturnValue(asyncIterator())
    jest.spyOn(github, 'getPullRequest').mockResolvedValue({ data: FoundPr })

    expect(await findMergedPullRequest()).toEqual(FoundPr)
  })

  it('does not find a merged pull request', async () => {
    jest.spyOn(github, 'closedPRsIterator').mockReturnValue(asyncIterator())
    jest.spyOn(inputs, 'sha').mockReturnValue('xyz789')
    jest.spyOn(inputs, 'pageLimit').mockReturnValue(10)

    expect(await findMergedPullRequest()).toBeNull()
  })

  it('iterates over all pages', async () => {
    jest.spyOn(github, 'closedPRsIterator').mockReturnValue(asyncIterator())
    jest.spyOn(inputs, 'pageLimit').mockReturnValue(100)
    jest.spyOn(inputs, 'sha').mockReturnValue('jkl012')
    jest
      .spyOn(github, 'getPullRequest')
      .mockResolvedValue({ data: SecondPagePr })

    expect(await findMergedPullRequest()).toMatchObject({
      merge_commit_sha: 'jkl012'
    })
  })
})
