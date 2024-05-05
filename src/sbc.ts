import { getSymlinks } from './utils/utils'
import path from 'path'
import fs from 'fs'

for (const [category, items] of getSymlinks())
{
  if (!fs.existsSync(category)) continue

  items.forEach((item) =>
  {
    const symlinkPath = path.join(category, path.basename(item))

    if (fs.existsSync(symlinkPath))
      fs.unlinkSync(symlinkPath)

    fs.symlinkSync(item, symlinkPath)
  })
}
