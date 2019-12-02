import simulateKey from '../simulate-key'

export default function (plugin, editor) {
  plugin.onKeyDown(simulateKey('arrowup'), editor, () => {})
  return editor
}
