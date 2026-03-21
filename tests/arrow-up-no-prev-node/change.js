import simulateKey from '../simulate-key.js'

export default function (plugin, editor) {
  plugin.onKeyDown(simulateKey('arrowup'), editor, () => {})
  return editor
}
