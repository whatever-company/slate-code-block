import simulateKey from '../simulate-key.js'

export default function (plugin, editor) {
  return plugin.onKeyDown(simulateKey('shift+tab'), editor, () => {})
}
