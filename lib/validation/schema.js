import { Block } from 'slate'
import {
  CHILD_TYPE_INVALID,
  CHILD_OBJECT_INVALID,
  PARENT_TYPE_INVALID,
  PARENT_OBJECT_INVALID
} from 'slate-schema-violations'
import { List } from 'immutable'

/**
 * Create a schema definition with rules to normalize code blocks
 */
function schema (opts) {
  const baseSchema = {
    blocks: {
      [opts.containerType]: {
        nodes: [{ match: [{ type: opts.lineType }] }],
        normalize (editor, error) {
          switch (error.code) {
            case CHILD_OBJECT_INVALID:
            case CHILD_TYPE_INVALID:
              return onlyLine(opts, editor, error)
            default:
              return undefined
          }
        }
      },
      [opts.lineType]: {
        nodes: [{ match: [{ object: 'text', min: 1 }] }],
        parent: { type: opts.containerType },
        normalize (editor, error) {
          switch (error.code) {
            case PARENT_OBJECT_INVALID:
            case PARENT_TYPE_INVALID:
              return noOrphanLine(opts, editor, error)
            default:
              return undefined
          }
        }
      }
    }
  }

  if (!opts.allowMarks) {
    baseSchema.blocks[opts.lineType].marks = []
  }

  return baseSchema
}

/**
 * Return a list of group of nodes matching the given filter.
 */
function getSuccessiveNodes (nodes, match) {
  const nonLines = nodes.takeUntil(match)
  const afterNonLines = nodes.skip(nonLines.size)
  if (afterNonLines.isEmpty()) {
    return List()
  }

  const firstGroup = afterNonLines.takeWhile(match)
  const restOfNodes = afterNonLines.skip(firstGroup.size)

  return List([firstGroup]).concat(getSuccessiveNodes(restOfNodes, match))
}

/**
 * A rule that ensure code blocks only contain lines of code, and no marks
 */
function onlyLine (opts, editor, error) {
  const isNotLine = (n) => n.type !== opts.lineType
  const nonLineGroups = getSuccessiveNodes(error.node.nodes, isNotLine)

  nonLineGroups
    .filter((group) => !group.isEmpty())
    .forEach((nonLineGroup) => {
      // Convert text to code lines
      const text = nonLineGroup.map((n) => n.text).join('')
      const codeLines = editor.deserializeCode(text).nodes

      // Insert them in place of the invalid node
      const first = nonLineGroup.first()
      const parent = editor.value.document.getParent(first.key)
      const invalidNodeIndex = parent.nodes.indexOf(first)

      editor.withoutNormalizing(() => {
        codeLines.forEach((codeLine, index) => {
          editor.insertNodeByKey(parent.key, invalidNodeIndex + index, codeLine)
        })
      })

      // Remove the block
      editor.withoutNormalizing(() => {
        nonLineGroup.forEach((n) => editor.removeNodeByKey(n.key))
      })
    })

  return editor
}

/**
 * A rule that ensure code lines are always children
 * of a code block.
 */
function noOrphanLine (opts, editor, error) {
  const { parent } = error

  const isLine = (n) => n.type === opts.lineType

  const linesGroup = getSuccessiveNodes(parent.nodes, isLine)

  editor.withoutNormalizing(() => {
    linesGroup.forEach((group) => {
      const container = Block.create({ type: opts.containerType, nodes: [] })
      const firstLineIndex = parent.nodes.indexOf(group.first())

      editor.insertNodeByKey(parent.key, firstLineIndex, container)

      group.forEach((line, index) =>
        editor.moveNodeByKey(line.key, container.key, index)
      )
    })
  })
}

export default schema
