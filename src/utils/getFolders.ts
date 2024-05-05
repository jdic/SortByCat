import type { IRule } from '../types/DRules'
import { Config } from '../config/config'
import { parseRules } from './parseRules'
import path from 'path'
import fs from 'fs'

export const findFoldersWithFile = (rootFolder: string, endsUntil: string, allowRootOnly = false): string[] =>
{
  const folders: string[] = []

  const exploreFolders = (currentFolder: string): void =>
  {
    if (fs.lstatSync(currentFolder).isFile()) return

    const subFolders = fs.readdirSync(currentFolder, { withFileTypes: true })
      .filter((dirent) => allowRootOnly ? true : dirent.isDirectory() && !dirent.name.startsWith('.'))
      .filter((dirent) => !Config.IGNORED_FOLDERS.includes(dirent.name))

    subFolders.forEach((subFolder) =>
    {
      const subFolderPath = path.join(currentFolder, subFolder.name)

      if (allowRootOnly && subFolder.isFile() && subFolderPath.endsWith(endsUntil))
        folders.push(path.parse(subFolderPath).dir)

      else if (subFolder.isDirectory() && fs.existsSync(path.join(subFolderPath, endsUntil)))
        folders.push(subFolderPath)

      else
        exploreFolders(subFolderPath)
    })
  }

  const rootFolders = fs.readdirSync(rootFolder, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && !dirent.name.startsWith('.'))
    .map((dirent) => path.join(rootFolder, dirent.name))

  rootFolders.forEach((folder) => exploreFolders(folder))

  return folders
}

export const gestDestinationFolders = (): Map<string, Map<string, IRule>> =>
{
  const destinationFolders = new Map<string, Map<string, IRule>>()
  const items = findFoldersWithFile(Config.DESTINATION_FOLDER, '.rules', true)

  items.forEach((item) =>
  {
    const object = parseRules(path.join(item, '.rules'))
    destinationFolders.set(item, object)
  })

  return destinationFolders
}

export const getOriginFolders = (): string[] =>
  findFoldersWithFile(Config.SOURCE_FOLDER, 'package.json')