import detectIndent from './detectIndent'

const DEFAULT_INDENTATION = '  '

/**
 * Detect indentation in a text
 */
function getIndent(text, defaultValue = DEFAULT_INDENTATION) {
  return detectIndent(text).indent || defaultValue
}

export default getIndent
