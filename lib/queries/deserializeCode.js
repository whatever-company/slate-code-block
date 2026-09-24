import Slate from 'slate'
const { Block, Text } = Slate
import detectNewline from '../utils/detectNewline.js'

const DEFAULT_NEWLINE = '\n'

/**
 * Deserialize a text into a code block
 */
function deserializeCode(opts, editor, text) {
  const sep = detectNewline(text) || DEFAULT_NEWLINE

  const lines = text.split(sep).map(line =>
    Block.create({
      type: opts.lineType,
      nodes: [Text.create(line)],
    }),
  )

  return Block.create({
    type: opts.containerType,
    nodes: lines,
  })
}

export default deserializeCode
