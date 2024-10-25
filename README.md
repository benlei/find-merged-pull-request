# benlei/get-merged-pull-request

[![GitHub Super-Linter](https://github.com/benlei/get-merged-pull-request/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/benlei/get-merged-pull-request/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/benlei/get-merged-pull-request/actions/workflows/check-dist.yml/badge.svg)](https://github.com/benlei/get-merged-pull-request/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/benlei/get-merged-pull-request/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/benlei/get-merged-pull-request/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

This action can be used to try to match the current commit of the running
workflow to a closed (merged) pull request. This can be useful for workflows
where you need information about the pull request that was just merged but can't
use the `pull_request` event due to the limitations around the event.

## Inputs

<!-- markdownlint-disable MD013 -->

| Name         | Required | Default               | Description                                                        |
| ------------ | -------- | --------------------- | ------------------------------------------------------------------ |
| `token`      | no       | `${{ github.token }}` | GitHub token to use for API requests.                              |
| `page-limit` | no       | `1`                   | The maximum number of pages to search for a matching pull request. |

<!-- markdownlint-enable MD013 -->

## Outputs

<!-- markdownlint-disable MD013 -->

| Name             | Description                                                             |
| ---------------- | ----------------------------------------------------------------------- |
| `number`         | The number of the pull request that was merged.                         |
| `title`          | The title of the pull request that was merged.                          |
| `body`           | The body of the pull request that was merged.                           |
| `labels`         | The labels of the pull request that was merged, separated by commas.    |
| `labels-json`    | The labels of the pull request that was merged, in JSON format.         |
| `user`           | The user that opened the pull request that was merged.                  |
| `assignees`      | The assignees of the pull request that was merged, separated by commas. |
| `assignees-json` | The assignees of the pull request that was merged, in JSON format.      |
| `milestone`      | The milestone of the pull request that was merged.                      |
| `merged_by`      | The user that merged the pull request that was merged.                  |

<!-- markdownlint-enable MD013 -->

## Example usage

```yaml
- name: Get merged pull request
  id: merged
  uses: benlei/get-merged-pull-request@v1
  with:
    token: ${{ secrets.GITHUB_TOKEN }}

- name: Send a message if the merged pull request contains a 'fix' label
  if: ${{ contains(fromJSON(steps.merged.outputs.labels-json), 'fix') }}
  run: echo "The merged pull request contains a 'fix' label."
```
