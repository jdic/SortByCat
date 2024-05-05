import type { IRule } from '../types/DRules'
import { Config } from '../config/config'
import { parseRules } from './parseRules'
import path from 'path'
import fs from 'fs'

export const findFoldersWithFile = (rootFolder: string, endsUntil: string[], allowRootOnly = false): string[] =>
{
  const folders: string[] = []

  const exploreFolders = (currentFolder: string): void =>
  {
    if (fs.lstatSync(currentFolder).isFile()) return
    if (Config.IGNORED_FOLDERS.some((ignoredFolder) => !allowRootOnly && currentFolder.includes(ignoredFolder))) return

    const subFolders = fs.readdirSync(currentFolder, { withFileTypes: true })
      .filter((dirent) => allowRootOnly ? true : !dirent.name.startsWith('.'))
      .filter((dirent) => !Config.IGNORED_FOLDERS.includes(dirent.name))

    subFolders.forEach((subFolder) =>
    {
      const itemPath = path.join(currentFolder, subFolder.name)

      if (allowRootOnly && subFolder.isFile() && endsUntil.some((ends) => itemPath.endsWith(ends)))
        folders.push(path.parse(itemPath).dir)

      else if (subFolder.isDirectory() && endsUntil.some((ends) => fs.existsSync(path.join(itemPath, ends))))
        folders.push(itemPath)

      else if (subFolder.isFile() && endsUntil.some((ends) => ends.startsWith('.') && itemPath.endsWith(ends)))
        folders[folders.length - 1].includes(itemPath) ? null : folders.push(path.parse(itemPath).dir)

      else
        exploreFolders(itemPath)
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
  const items = findFoldersWithFile(Config.DESTINATION_FOLDER, ['.rules'], true)

  items.forEach((item) =>
  {
    const object = parseRules(path.join(item, '.rules'))
    destinationFolders.set(item, object)
  })

  return destinationFolders
}

export const getOriginFolders = (): string[] =>
  findFoldersWithFile(Config.SOURCE_FOLDER, ['package.json', '.cpp'])