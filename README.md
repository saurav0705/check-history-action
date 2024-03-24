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

You can provide input directly to the file or you can provide a config file

### DIRECT INPUT

#### This is to check file

```yaml
- name: Check Changed File
  uses: saurav0705/check-history-action@v1
  id: check-changed-file
  with:
    GIT_TOKEN: ${{secrets.GIT_SECRET}}
    CONFIG: |
      disable: false // disables the check
      comment:
        disable: false // disables the PR comment
        retentionDays: 30 // artifact which contains the PR comment info if not given is set to 30 days
      checks:
        - key: name
          pattern:
            - PATH_1
            - PATH_2
          disbale: false // disable individual check
          disableInComment: false // does not post status in message
```

or

```yaml
# .github/config.yml
disable: false // disables the check
comment:
  disable: false // disables the PR comment
  retentionDays: 30 // artifact which contains the PR comment info if not given is set to 30 days
checks:
  - key: name
    pattern:
      - PATH_1
      - PATH_2
    disbale: false // disable individual check
    disableInComment: false // does not post status in message

# check.yml
- name: Check Changed File
  uses: saurav0705/check-history-action@v1
  id: check-changed-file
  with:
    GIT_TOKEN: ${{secrets.GIT_SECRET}}
    CONFIG: ./.github/config.yml
```

#### This is to Upload Artifact

```yml
# This will be consumed by the job
- name: Check Changed File
  uses: saurav0705/check-history-action@v1
  id: check-changed-file
  with:
    GIT_TOKEN: ${{secrets.GIT_SECRET}}
    UPLOAD: |
      key: JOB_NAME
      retentionDays : 30 #default it is set to 30
```

### `GIT_TOKEN`

The GitHub token used to authenticate API requests. You can use the `{{ secrets.GITHUB_TOKEN }}` token available in your workflow without any additional setup.

### `CONFIG` (required)

## Explanation of Configuration

### Disable Settings

- **disable**: `boolean`
  - Description: This setting controls the overall disabling of the action.
  - Value: `false` indicates that the feature is enabled and is default value.

### Comment Settings

- **disable**: `false`
  - Description: This sub-setting under `comment` controls the disabling of pr commenting functionality.
  - Value: `false` indicates that commenting functionality is enabled which is default.
- **retentionDays**: `30`
  - Description: This sub-setting specifies the retention period for pr comment.
  - Value: `30` indicates comments will be retained for 30 days which is bt default.

### Checks

- **key**: `string`
  - Description: This setting specifies a key which is identify against which check you are running the checks.
- **pattern**:
  - Description: This setting defines the pattern against which checks will be applied.
  - Value: `/file/pattern` represents the picomatch expression pattern used for matching.

### `UPLOAD`

- **key**: `string`
  - Description: This setting specifies a key which is identify against which check you are uploading the `sha`.
- **retentionDays**:
  - Description: This setting defines the pattern against which checks will be applied.
  - Value: `/file/pattern` represents the picomatch expression pattern used for matching.

### `ARTIFACT_RETENTION_DAYS`

This is used to set artifact retention days while logging a successful run and will be consumed when `UPLOAD_KEYS` is given.

## Outputs

This Return a `status` object in which the following are present

```json
{
  "job_1": {
    "shouldRun": true, // boolean
    "key": "job_1-{pr-number}", // string
    "suppliedKey": "job_1", // string
    "filesRegex": "regex", // string
    "sha": "some-sha", // string
    "diffFiles": ["file-1", "file-2"] // Array<string>
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
        node-version: '20'

    - name: Run Check Changed Files
      id: changed-files
      uses: saurav0705/check-history-action@v1
      with:
          GIT_TOKEN: ${{secrets.GIT_SECRET}}
          CONFIG: |
            checks
              - key: JOB_NAME
                pattern:
                  - file/pattern/match

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
        node-version: '20'

    - name: Install Dependencies
      run: do something

    - name: Upload sucess
      uses: saurav0705/check-history-action@v1
      with:
          GIT_TOKEN: ${{secrets.GIT_SECRET}}
          UPLOAD: |
            name: JOB_NAME
            retentionDays : 30
```

## Support

For any questions or issues regarding this GitHub Action, please open an issue in the repository.
