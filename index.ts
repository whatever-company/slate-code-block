import { Editor, Block } from 'slate'

export interface EditCodeOptions {
  /** Type of the code containers. Default: 'code_block' */
  containerType?: string
  /** Type of the code lines. Default: 'code_line' */
  lineType?: string
  /** Block type to exit into. Default: 'paragraph' */
  exitBlockType?: string
  /** Handle select-all inside code container. Default: true */
  selectAll?: boolean
  /** Allow marks inside code blocks. Default: false */
  allowMarks?: boolean
  /** Returns the indent unit to use at the given selection */
  getIndent?: ((editor: Editor) => string) | null
  /** Custom exit handler. Overrides exitBlockType if provided */
  onExit?: ((editor: Editor) => Editor) | null
}

export interface EditCodePlugin {
  schema: object
  commands: {
    unwrapCodeBlockByKey: (editor: Editor, key: string) => Editor
    wrapCodeBlockByKey: (editor: Editor, key: string) => Editor
    wrapCodeBlock: (editor: Editor) => Editor
    wrapCodeBlocks: (editor: Editor) => Editor
    unwrapCodeBlock: (editor: Editor) => Editor
    toggleCodeBlock: (editor: Editor) => Editor
    indentLines: (editor: Editor) => Editor
    dedentLines: (editor: Editor) => Editor
  }
  queries: {
    isInCodeBlock: (editor: Editor) => boolean
    deserializeCode: (editor: Editor, text: string) => Block
    getCurrentCode: (editor: Editor) => Block | null
    getCurrentIndent: (editor: Editor) => string
  }
  onKeyDown: (event: Event, editor: Editor, next: () => void) => void
  onPaste: (event: Event, editor: Editor, next: () => void) => void
}

declare function EditCode(options?: EditCodeOptions): EditCodePlugin
export default EditCode
