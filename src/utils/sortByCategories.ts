import { gestDestinationFolders, getOriginFolders } from './getFolders'
import { ActionType } from '../types/DRules'
import path from 'path'
import fs from 'fs'

export const sortByCategories = (): Map<string, string[]> =>
{
  const sortedCategories = new Map<string, string[]>()
  const destinationFolders = gestDestinationFolders()
  const sourceFolders = getOriginFolders()

  for (const [categoryPath, content] of destinationFolders)
  {
    if (!sortedCategories.has(categoryPath))
      sortedCategories.set(categoryPath, [])

    for (const [dir, rules] of content)
    {
      const { type, match } = rules

      for (const folder of sourceFolders)
      {
        const itemPath = path.join(folder, dir)
        if (!fs.existsSync(itemPath)) continue

        try
        {
          if (type === ActionType.Folder)
          {
            const items = fs.readdirSync(itemPath)

            if (items.some((item) => match.some((regex) => regex.test(item))))
              sortedCategories.get(categoryPath)?.push(itemPath)
          }

          else if (type === ActionType.File)
          {
            const item = fs.readFileSync(itemPath, 'utf8')

            if (match.some((regex) => regex.test(item)))
              sortedCategories.get(categoryPath)?.push(itemPath)
          }
        }

        catch (error) { console.error(error) }
      }
    }
  }

  return sortedCategories
}