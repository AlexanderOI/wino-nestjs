import { JSONContentNode } from '@/common/json-content.dto'

export function extractMentionIds(content: JSONContentNode): string[] {
  const mentionIds: string[] = []

  function traverseNode(node: any) {
    if (node.type === 'mention' && node.attrs?.id) {
      mentionIds.push(node.attrs.id)
    }

    if (node.content && Array.isArray(node.content)) {
      node.content.forEach(traverseNode)
    }
  }

  traverseNode(content)
  return mentionIds
}
