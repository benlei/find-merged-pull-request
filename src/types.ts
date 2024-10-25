export interface PullRequestsResponse {
  data: PullRequest[]
}

export interface PullRequest {
  id: number
  number: number
  title: string
  user: User | null
  body: string | null
  merge_commit_sha: string | null
  assignees?: User[] | null
  merged_by?: User
  labels: Label[]
  milestone: Milestone | null
}

export interface User {
  login: string
}

export interface Label {
  name: string
}

export interface Milestone {
  title: string
}
