import { isKeyHotkey } from 'is-hotkey'

import onTab from './onTab.js'
import onShiftTab from './onShiftTab.js'
import onEnter from './onEnter.js'
import onModEnter from './onModEnter.js'
import onBackspace from './onBackspace.js'
import onSelectAll from './onSelectAll.js'
import onArrow from './onArrow.js'

const isModA = isKeyHotkey('mod+a')
const isShiftTab = isKeyHotkey('shift+tab')
const isTab = isKeyHotkey('tab')
const isModEnter = isKeyHotkey('mod+enter')
const isEnter = isKeyHotkey('enter')
const isBackspace = isKeyHotkey('backspace')
const isArrowUp = isKeyHotkey('arrowup')
const isArrowDown = isKeyHotkey('arrowdown')

/**
 * User is pressing a key in the editor
 */
function onKeyDown (opts, event, editor, next) {
  const currentCode = editor.getCurrentCode()

  // Inside code ?
  if (!currentCode) {
    return next()
  }

  // Add opts in the argument list
  const args = [opts, event, editor, next]

  // Select all the code in the block (Mod+a)
  if (opts.selectAll && isModA(event)) {
    return onSelectAll(...args)
  } else if (isShiftTab(event)) {
    // User is pressing Shift+Tab
    return onShiftTab(...args)
  } else if (isTab(event)) {
    // User is pressing Tab
    return onTab(...args)
  } else if (opts.exitBlockType && isModEnter(event)) {
    // User is pressing Mod+Enter
    return onModEnter(...args)
  } else if (isEnter(event)) {
    // User is pressing Enter
    return onEnter(...args)
  } else if (isBackspace(event)) {
    // User is pressing Backspace
    return onBackspace(...args)
  } else if (isArrowDown(event) || isArrowUp(event)) {
    // User is pressing arrow
    return onArrow(...args)
  }
  return next()
}

export default onKeyDown
