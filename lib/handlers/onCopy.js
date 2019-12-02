export default function onCopy (event, editor, next) {
  const { value } = editor
  const currentCode = editor.getCurrentCode()

  // Only handle paste when selection is completely a code block
  const { endBlock } = value
  if (!currentCode || !currentCode.hasDescendant(endBlock.key)) {
    return next()
  }
}
