export default function onCopy(event, editor, next) {
  const { value } = editor;
  const data = getEventTransfer(event);
  const currentCode = editor.getCurrentCode();

  // Only handle paste when selection is completely a code block
  const { endBlock } = value;
  if (!currentCode || !currentCode.hasDescendant(endBlock.key)) {
    return next();
  }
}
