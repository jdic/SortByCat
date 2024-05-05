import { ActionType, type IRule } from '../types/DRules'
import fs from 'fs'

const parseRulesContent = (content: string): RegExp[] =>
  content.trim().split('\n').map((rawRegex) => new RegExp(rawRegex))

const getRuleObject = (operatesOn: string, rawContent: string): IRule =>
{
  return {
    type: operatesOn.startsWith('/') ? ActionType.Folder : ActionType.File,
    match: parseRulesContent(rawContent)
  }
}

export const parseRules = (rulesFile: string): Map<string, IRule> =>
{
  const rules = new Map<string, IRule>()
  const rawLines: string[] = fs.readFileSync(rulesFile, 'utf8').split('\n')

  let [operatesOn, rawContent] = ['', '']

  for (const line of rawLines)
  {
    if (!line.startsWith(' '))
    {
      if (operatesOn !== '')
      {
        const rule: IRule = getRuleObject(operatesOn, rawContent)
        rules.set(operatesOn, rule)
      }

      [operatesOn, rawContent] = [line, '']
    }

    else
    {
      rawContent += line.trim() + '\n'
    }
  }

  if (operatesOn !== '')
  {
    const rule: IRule = getRuleObject(operatesOn, rawContent)
    rules.set(operatesOn, rule)
  }

  return rules
}