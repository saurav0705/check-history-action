# Check History Action

This GitHub Action extracts the `sha` of the last successful run of a specified job, compares it with the latest commit, finds the changed files, and performs a pattern match provided by the user. If the pattern matches any changed files, it returns `true` otherwise, it returns `false`.

## Dependencies

This GitHub Action relies on the following dependencies:

- `@actions/core`: The @actions/core package provides functions for setting and getting input and output variables used in GitHub Actions.
- `@actions/github`: The @actions/github package provides functions for interacting with the GitHub API in GitHub Actions.
- `octokit`: The octokit package is used for making API requests to the GitHub API.
- `picomatch`: The picomatch package is used for pattern matching using regular expressions.
- `@actions/artifacts`: The @actions/artifacts package is used for uploading and downloading artifacts.
- `adm-zip`: The adm-zip package is used for unzipping the zip files.

Ensure that you have these dependencies installed or included in your workflow environment before using this action.

## Inputs

```yaml
# This is to check file
      - name: Check Changed File
        uses: saurav0705/check-history-action@v1
        id: check-changed-file
        with:
          GIT_TOKEN: ${{secrets.GIT_SECRET}}
          KEYS: |
            - key: android-lint
              pattern: android/**
            - key: android-detekt
              pattern: android/**

# This will be consumed by the job
      - name: Check Changed File
        uses: saurav0705/check-history-action@v1
        id: check-changed-file
        with:
          GIT_TOKEN: ${{secrets.GIT_SECRET}}
          # if UPLOAD_KEYS is present KEYS will be ignored
          UPLOAD_KEY: JOB_NAME_1
          ARTIFACT_RETENTION_DAYS: '30' #default it is set to 30
```

### `GIT_TOKEN` (required)

The GitHub token used to authenticate API requests. You can use the `{{ secrets.GITHUB_TOKEN }}` token available in your workflow without any additional setup.

### `KEYS` (required)
This is the key in which we mention the workflow name and pattern that we want to match which are seperated by `,`.

### `UPLOAD_KEY` (required)
This is required when you want to update the successful run of a job.

### `DISABLE_CHECK` 
This is used if you want to disable check then all the keys that are provided will have shouldRun as `true`.

### `DISABLE_PR_COMMENT` 
This is used if you want to disable pr comment if this is truned as `true` this action will not post the comment.

### `ARTIFACT_RETENTION_DAYS` 
This is used to set artifact retention days while logging a successful run and will be consumed when `UPLOAD_KEYS` is given.

## Outputs

This Return a `status` object in which the following are present

```json
{
    "job_1" : {
      "shouldRun" : true, // boolean
      "key" : "job_1-{pr-number}", // string
      "suppliedKey" : "job_1", // string
      "filesRegex" : "regex", // string
      "sha":"some-sha", // string
      "diffFiles" : [ "file-1","file-2" ] // Array<string>
    }
}
```

### `shouldRun`
It's a boolean which tell if these 2 commits have pattern matching file change.

### `key`
It's a string which is the job key for which this is fetched appended with pr number.

### `filesRegex`
It's a string which is the regex for file path match.

### `sha`
sha for last successful run.

### `diffFiles`
Array of files that has been changed between current and last successfull sha.


## Usage

To use this GitHub Action in your workflow, create a new YAML file (e.g., .github/workflows/regex-commenter.yml) in your repository and add the following code:

```yaml
name: Check Changed Files Example

on:
  pull_request:

jobs:
  setup:
    runs-on: ubuntu-latest
    outputs:
      JOB_NAME : ${{steps.changed-files.outputs.JOB_NAME}} 
    steps:
    - name: Checkout code
      uses: actions/checkout@v2

    - name: Set up Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '14'

    - name: Run Check Changed Files
      id: changed-files
      uses: saurav0705/check-history-action@v1
      with:
          GIT_TOKEN: ${{secrets.GIT_SECRET}}
          KEYS: |
            - key: android-lint
              pattern: android/**
            - key: android-detekt
              pattern: android/**

    - name: Print status
      run: echo "Action status: ${{ steps.regex_commenter.outputs.status }}"

  child_job:
    runs-on: ubuntu-latest
    needs : [setup]
    if: ${{ fromJSON(needs.setup.outputs.JOB_NAME.shouldRun) == 'true' }}
    steps:
    - name: Checkout code
      uses: actions/checkout@v2

    - name: Set up Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '14'

    - name: Install Dependencies
      run: do something

    - name: Upload sucess
      uses: saurav0705/check-history-action@v1
      with:
          GIT_TOKEN: ${{secrets.GIT_SECRET}}
          UPLOAD_KEY: JOB_NAME
          ARTIFACT_RETENTION_DAYS: '30'

```


## Support

For any questions or issues regarding this GitHub Action, please open an issue in the repository.
