import Slate from 'slate'
import Immutable from 'immutable'
const { Block, Text } = Slate
const { List } = Immutable
import detectNewline from '../utils/detectNewline.js'

const DEFAULT_NEWLINE = '\n'

/**
 * Deserialize a text into a code block
 */
function deserializeCode(opts, editor, text) {
  const sep = detectNewline(text) || DEFAULT_NEWLINE

  const lines = List(text.split(sep)).map(line => {
    return Block.create({
      type: opts.lineType,
      nodes: [Text.create(line)],
    })
  })

  const code = Block.create({
    type: opts.containerType,
    nodes: lines,
  })

  return code
}

export default deserializeCode
