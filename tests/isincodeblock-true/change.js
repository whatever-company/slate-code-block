import assert from 'assert'

export default function (plugin, editor) {
  assert.strictEqual(editor.isInCodeBlock(), true)

  return editor
}
