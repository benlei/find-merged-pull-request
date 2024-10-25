import * as pr from '../src/pr'
import * as core from '@actions/core'
import { PullRequest } from '../src/types'
import { run } from '../src/main'

const ExamplePr: PullRequest = {
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

describe('run', () => {
  it('should set outputs when a PR is found', async () => {
    jest.spyOn(pr, 'findMergedPullRequest').mockResolvedValue(ExamplePr)
    const setOutputSpy = jest
      .spyOn(core, 'setOutput')
      .mockImplementation(() => {})
    await run()
    expect(setOutputSpy).toHaveBeenCalledWith('title', 'foo')
    expect(setOutputSpy).toHaveBeenCalledWith('number', '42')
    expect(setOutputSpy).toHaveBeenCalledWith('body', 'hello world')
    expect(setOutputSpy).toHaveBeenCalledWith('user', 'octocat')
    expect(setOutputSpy).toHaveBeenCalledWith('assignees', '')
    expect(setOutputSpy).toHaveBeenCalledWith('labels', 'bug,enhancement')
    expect(setOutputSpy).toHaveBeenCalledWith(
      'labels-json',
      '["bug","enhancement"]'
    )
    expect(setOutputSpy).toHaveBeenCalledWith('milestone', 'v1.0')
    expect(setOutputSpy).toHaveBeenCalledWith('merged_by', 'github')
  })

  it('should still return json outputs even if PR not found', async () => {
    jest.spyOn(pr, 'findMergedPullRequest').mockResolvedValue(null)
    const setFailedSpy = jest
      .spyOn(core, 'setFailed')
      .mockImplementation(() => {})
    const setOutputSpy = jest
      .spyOn(core, 'setOutput')
      .mockImplementation(() => {})

    await run()
    expect(setFailedSpy).not.toHaveBeenCalled()
    expect(setOutputSpy).toHaveBeenCalledWith('assignees-json', '[]')
    expect(setOutputSpy).toHaveBeenCalledWith('labels-json', '[]')
  })

  it('should set the workflow as failed if an error occurs', async () => {
    jest
      .spyOn(pr, 'findMergedPullRequest')
      .mockRejectedValue(new Error('test error'))
    const setFailedSpy = jest
      .spyOn(core, 'setFailed')
      .mockImplementation(() => {})
    await run()
    expect(setFailedSpy).toHaveBeenCalledWith('test error')
  })
})
