/* istanbul ignore file */
import * as core from '@actions/core'
import { context } from '@actions/github'

export const githubTokenInput = (): string =>
  core.getInput('token', {
    required: false,
    trimWhitespace: true
  })

export const pageLimitInput = (): string =>
  core.getInput('page-limit', {
    required: false,
    trimWhitespace: true
  })

export const contextSha = (): string => context.sha
