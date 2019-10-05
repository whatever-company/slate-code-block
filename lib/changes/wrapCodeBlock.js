import wrapCodeBlockByKey from './wrapCodeBlockByKey'
import wrapCodeBlocks from './wrapCodeBlocks'

/**
 * Wrap current block into a code block.
 */
function wrapCodeBlock(opts, editor) {
  const { value } = editor
  const { startBlock, blocks, selection } = value

  if (blocks.length == 0) {
    return editor
  };

  // Convert to code block
  if (blocks.length <= 1) {
    wrapCodeBlockByKey(opts, editor, startBlock.key)
  } else {
    // merge multiple blocks
    wrapCodeBlocks(opts, editor, blocks)
  }

  // Move selection back in the block
  editor
    .moveToStartOfNode(editor.value.document.getDescendant(startBlock.key))
    .moveTo(selection.start.offset)

  return editor
}

export default wrapCodeBlock
