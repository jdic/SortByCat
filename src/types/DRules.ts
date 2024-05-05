export enum ActionType
{
  Folder = 'folder',
  File = 'file'
}

export interface IRule
{
  type: ActionType
  match: RegExp[]
}
