import type { IConfig } from '../types/IConfig'

const getValue = (query: string): string =>
{
  const value = process.env[query]

  if (value === undefined || value === null)
    throw new Error(`Missing environment variable: ${query}`)

  return value
}

const createConfig = (): IConfig =>
{
  return {
    SOURCE_FOLDER: '/home/jdi',//getValue('SBC_SOURCE_FOLDER'),
    DESTINATION_FOLDER: '/home/jdi/Desktop/Sort by Cat',//getValue('SBC_DESTINATION_FOLDER')
    IGNORED_FOLDERS: ['node_modules', '/home/jdi/Desktop/Sort by Cat'] //getValue('SBC_IGNORED_FOLDERS').split(',')
  }
}

export const Config: IConfig = createConfig()
