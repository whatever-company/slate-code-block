/**
 * User pressed Shift+Tab in an editor:
 * Reduce indentation in the selected lines.
 */
function onShiftTab (opts, event, editor, next) {
  event.preventDefault()
  event.stopPropagation()

  // We dedent all selected lines
  return editor.dedentLines()
}

export default onShiftTab
