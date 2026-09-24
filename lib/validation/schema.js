import Slate from 'slate'
import * as violations from 'slate-schema-violations'
const { Block } = Slate
const {
  CHILD_TYPE_INVALID,
  CHILD_OBJECT_INVALID,
  PARENT_TYPE_INVALID,
  PARENT_OBJECT_INVALID,
} = violations

/**
 * Create a schema definition with rules to normalize code blocks
 */
function schema(opts) {
  const baseSchema = {
    blocks: {
      [opts.containerType]: {
        nodes: [{ match: [{ type: opts.lineType }] }],
        normalize(editor, error) {
          switch (error.code) {
            case CHILD_OBJECT_INVALID:
            case CHILD_TYPE_INVALID:
              return onlyLine(opts, editor, error)
            default:
              return undefined
          }
        },
      },
      [opts.lineType]: {
        nodes: [{ match: [{ object: 'text', min: 1 }] }],
        parent: { type: opts.containerType },
        normalize(editor, error) {
          switch (error.code) {
            case PARENT_OBJECT_INVALID:
            case PARENT_TYPE_INVALID:
              return noOrphanLine(opts, editor, error)
            default:
              return undefined
          }
        },
      },
    },
  }

  if (!opts.allowMarks) {
    baseSchema.blocks[opts.lineType].marks = []
  }

  return baseSchema
}

/**
 * Group consecutive nodes matching the given predicate.
 * Returns an array of groups, each group being a non-empty array of nodes.
 */
function groupConsecutiveNodes(nodes, match) {
  const groups = []
  let current = null

  nodes.forEach(node => {
    if (!match(node)) {
      current = null
      return
    }
    if (!current) {
      current = []
      groups.push(current)
    }
    current.push(node)
  })

  return groups
}

/**
 * A rule that ensure code blocks only contain lines of code, and no marks
 */
function onlyLine(opts, editor, error) {
  const isNotLine = n => n.type !== opts.lineType
  const nonLineGroups = groupConsecutiveNodes(error.node.nodes, isNotLine)

  nonLineGroups.forEach(nonLineGroup => {
    // Convert text to code lines
    const text = nonLineGroup.map(n => n.text).join('')
    const codeLines = editor.deserializeCode(text).nodes

    // Insert them in place of the invalid node
    const [first] = nonLineGroup
    const parent = editor.value.document.getParent(first.key)
    const invalidNodeIndex = parent.nodes.indexOf(first)

    editor.withoutNormalizing(() => {
      codeLines.forEach((codeLine, index) => {
        editor.insertNodeByKey(parent.key, invalidNodeIndex + index, codeLine)
      })
    })

    // Remove the block
    editor.withoutNormalizing(() => {
      nonLineGroup.forEach(n => editor.removeNodeByKey(n.key))
    })
  })

  return editor
}

/**
 * A rule that ensure code lines are always children
 * of a code block.
 */
function noOrphanLine(opts, editor, error) {
  const { parent } = error

  const isLine = n => n.type === opts.lineType

  const linesGroup = groupConsecutiveNodes(parent.nodes, isLine)

  editor.withoutNormalizing(() => {
    linesGroup.forEach(group => {
      const container = Block.create({ type: opts.containerType, nodes: [] })
      const firstLineIndex = parent.nodes.indexOf(group[0])

      editor.insertNodeByKey(parent.key, firstLineIndex, container)

      group.forEach((line, index) =>
        editor.moveNodeByKey(line.key, container.key, index),
      )
    })
  })
}

export default schema
