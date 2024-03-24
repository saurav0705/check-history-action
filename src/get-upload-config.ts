import {checkForFileOrLoadYml, checkForNumber} from './utils'

type TUploadConfig = {
  key: string
  retentionDays: number
}

export const getUploadConfig = (config: string): TUploadConfig => {
  const _config = checkForFileOrLoadYml(config)
  if (!_config.key?.length) {
    throw new Error(`name is required to upload artifact`)
  }
  const initialConfig: TUploadConfig = {
    key: _config.key,
    retentionDays: 30
  }

  initialConfig.retentionDays = checkForNumber(_config.retentionDays)
  return initialConfig
}
