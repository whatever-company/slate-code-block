import { onKeyDown, onPaste } from './handlers/index.js'
import Options from './options.js'
import core from './core.js'

/**
 * A Slate plugin to handle keyboard events in code blocks.
 */

function EditCode (optsParam = {}) {
  const opts = new Options(optsParam)

  const corePlugin = core(opts)
  return {
    ...corePlugin,

    onKeyDown: onKeyDown.bind(null, opts),
    onPaste: onPaste.bind(null, opts)
  }
}

export default EditCode
