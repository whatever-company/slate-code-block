import type { List } from 'immutable'
import type { Block, Controller, SchemaProperties, Value } from 'slate'
import type { Plugin } from 'slate-react'

export interface EditCodeOptions {
  /** Type of the code containers. Default: 'code_block' */
  containerType?: string
  /** Type of the code lines. Default: 'code_line' */
  lineType?: string
  /**
   * Block type to exit into on Mod+Enter, Arrow Down on the last line, and
   * Backspace in an empty code block. Default: 'paragraph'
   */
  exitBlockType?: string
  /** Handle Mod+A inside a code block by selecting the whole block. Default: true */
  selectAll?: boolean
  /** Allow marks inside code blocks instead of normalizing them away. Default: false */
  allowMarks?: boolean
  /** Returns the indent unit to use for the given value. Defaults to auto-detection. */
  getIndent?: ((value: Value) => string) | null
  /** Custom exit handler. Takes precedence over `exitBlockType`. The return value is ignored. */
  onExit?: ((editor: Controller) => unknown) | null
}

/** A Slate command: receives the editor and returns it. */
type Command<Args extends unknown[] = []> = <T extends Controller>(
  editor: T,
  ...args: Args
) => T

/** A Slate query: receives the editor and returns a result. */
type Query<Result, Args extends unknown[] = []> = (
  editor: Controller,
  ...args: Args
) => Result

export interface EditCodePlugin extends Plugin {
  schema: SchemaProperties
  commands: {
    wrapCodeBlock: Command
    wrapCodeBlockByKey: Command<[key: string]>
    wrapCodeBlocks: Command<[blocks: List<Block>]>
    unwrapCodeBlock: Command<[type: string]>
    unwrapCodeBlockByKey: Command<[key: string, type: string]>
    toggleCodeBlock: Command<[type: string]>
    indentLines: Command<[indent?: string]>
    dedentLines: Command<[indent?: string]>
  }
  queries: {
    isInCodeBlock: Query<boolean>
    getCurrentCode: Query<Block | null, [key?: string]>
    getCurrentIndent: Query<string>
    deserializeCode: Query<Block, [text: string]>
  }
  onKeyDown: NonNullable<Plugin['onKeyDown']>
  onPaste: NonNullable<Plugin['onPaste']>
}

/** Methods the plugin registers on the editor. */
interface CodeBlockEditor {
  /** Convert the current block(s) into a code block. */
  wrapCodeBlock(): this
  /** Convert the block with the given key into a code block. */
  wrapCodeBlockByKey(key: string): this
  /** Merge the given blocks into a single code block. */
  wrapCodeBlocks(blocks: List<Block>): this
  /** Convert the current code block into blocks of the given type. */
  unwrapCodeBlock(type: string): this
  /** Convert the code block with the given key into blocks of the given type. */
  unwrapCodeBlockByKey(key: string, type: string): this
  /** Toggle between a code block and blocks of the given type. */
  toggleCodeBlock(type: string): this
  /** Indent every line in the selection. Defaults to the detected indent. */
  indentLines(indent?: string): this
  /** Dedent every line in the selection. Defaults to the detected indent. */
  dedentLines(indent?: string): this

  /** Whether the selection is inside a code block. */
  isInCodeBlock(): boolean
  /** The code block containing the selection, or the given line key. */
  getCurrentCode(key?: string): Block | null
  /** The indent unit detected in the current code block. */
  getCurrentIndent(): string
  /** Split a text into lines and build a code block from them. */
  deserializeCode(text: string): Block
}

declare module 'slate' {
  interface Editor extends CodeBlockEditor {}
}

declare module 'slate-react' {
  interface Editor extends CodeBlockEditor {}
}

declare function EditCode(options?: EditCodeOptions): EditCodePlugin
export default EditCode
