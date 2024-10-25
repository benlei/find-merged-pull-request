import * as core from '@actions/core'
import { findMergedPullRequest } from './pr'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const pr = await findMergedPullRequest()

    if (!pr) {
      core.setOutput('assignees-json', '[]')
      core.setOutput('labels-json', '[]')
      core.info('No matching PR found')
      return
    }

    core.setOutput('title', pr.title)
    core.setOutput('number', pr.number.toString())
    core.setOutput('body', pr.body || '')
    core.setOutput('user', pr.user?.login || '')
    core.setOutput(
      'assignees',
      pr.assignees?.map(assignee => assignee.login).join(',') || ''
    )
    core.setOutput(
      'assignees-json',
      JSON.stringify(pr.assignees?.map(assignee => assignee.login) || [])
    )
    core.setOutput('labels', pr.labels.map(label => label.name).join(','))
    core.setOutput(
      'labels-json',
      JSON.stringify(pr.labels.map(label => label.name))
    )
    core.setOutput('milestone', pr.milestone?.title || '')
    core.setOutput('merged_by', pr.merged_by?.login || '')
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
    else core.setFailed('An unexpected error occurred')
  }
}
