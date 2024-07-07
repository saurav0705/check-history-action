import {checkForBoolean, checkForFileOrLoadYml, checkForNumber} from './utils'

export type TChecks = {
  key: string
  pattern: string[]
  disableInComment: boolean
  disable: boolean
}

export type TComment = {
  disable: boolean
  artifactRetentionDays: number
}

type TConfig = {
  comment: TComment
  disable: boolean
  checks: TChecks[]
}

const checkForPatternArray = (value: any): string[] => {
  if (!Array.isArray(value)) {
    throw new Error(`pattern should be a type of array`)
  }
  return (value as any[]).map(item => item.toString())
}

const checkForChecks = (value: any): TChecks[] => {
  if (!Array.isArray(value)) {
    throw new Error(`checks should be a type of array`)
  }
  return (value as Partial<TChecks>[])
    .map(item => {
      return {
        key: item.key,
        pattern: checkForPatternArray(item.pattern),
        disableInComment: checkForBoolean(
          item.disableInComment?.toString() ?? 'false'
        ),
        disable: checkForBoolean(item.disable?.toString() ?? 'false')
      }
    })
    .filter(
      (item): item is TChecks => !!(item.key?.length && item.pattern.length)
    )
}

export const getConfig = (config: string): TConfig => {
  const initialConfig: TConfig = {
    disable: false,
    checks: [],
    comment: {
      disable: false,
      artifactRetentionDays: 0
    }
  }
  const _config = checkForFileOrLoadYml(config)
  initialConfig.disable = checkForBoolean(_config.disable_check)
  initialConfig.comment = {
    disable: checkForBoolean(_config.comment.disble_pr_comment),
    artifactRetentionDays: checkForNumber(_config.comment.artifactRetention)
  }
  initialConfig.checks = checkForChecks(_config.checks)

  return initialConfig
}