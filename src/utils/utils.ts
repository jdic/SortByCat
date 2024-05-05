import { sortByCategories } from './sortByCategories'

export const getSymlinks = (): Map<string, string[]> =>
  sortByCategories()