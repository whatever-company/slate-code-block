import Options from './options.js'
import { getCurrentIndent, deserializeCode, isInCodeBlock, getCurrentCode } from './queries/index.js'
import {
  wrapCodeBlockByKey,
  unwrapCodeBlockByKey,
  wrapCodeBlock,
  wrapCodeBlocks,
  unwrapCodeBlock,
  toggleCodeBlock,
  dedentLines,
  indentLines
} from './commands/index.js'

import { schema } from './validation/index.js'

/**
 * The core of the plugin, which does not relies on `slate-react`, and includes
 * everything but behavior and rendering logic.
 */
function core (optsParam) {
  const opts = new Options(optsParam)

  return {
    schema: schema(opts),

    commands: {
      unwrapCodeBlockByKey: unwrapCodeBlockByKey.bind(null, opts),
      wrapCodeBlockByKey: wrapCodeBlockByKey.bind(null, opts),
      wrapCodeBlock: wrapCodeBlock.bind(null, opts),
      wrapCodeBlocks: wrapCodeBlocks.bind(null, opts),
      unwrapCodeBlock: unwrapCodeBlock.bind(null, opts),
      toggleCodeBlock: toggleCodeBlock.bind(null, opts),
      indentLines: indentLines.bind(null, opts),
      dedentLines: dedentLines.bind(null, opts)

    },

    queries: {
      isInCodeBlock: isInCodeBlock.bind(null, opts),
      deserializeCode: deserializeCode.bind(null, opts),
      getCurrentCode: getCurrentCode.bind(null, opts),
      getCurrentIndent: getCurrentIndent.bind(null, opts)
    }
  }
}

export default core
