// Type-level test: compiled by `pnpm typecheck`, never executed.
import { Editor } from 'slate'
import { Editor as ReactEditor, Plugins } from 'slate-react'
import EditCode, { EditCodeOptions, EditCodePlugin } from '../index.js'

const options: EditCodeOptions = {
  exitBlockType: 'paragraph',
  getIndent: value => (value.document.text.includes('\t') ? '\t' : '  '),
  onExit: editor => editor.moveToStartOfDocument(),
}

const plugin: EditCodePlugin = EditCode(options)
const plugins: Plugins = [plugin, EditCode()]

// Commands and queries are available on both editor flavours.
declare const editor: Editor
declare const reactEditor: ReactEditor

const chained: Editor = editor.toggleCodeBlock('paragraph').focus()
const fromReact: ReactEditor = reactEditor.wrapCodeBlock().indentLines()
const inCode: boolean = editor.isInCodeBlock()
const indent: string = editor.getCurrentIndent()
const code = editor.getCurrentCode()
const lines = editor.deserializeCode('a\nb').nodes

// @ts-expect-error `type` is required until it defaults to `exitBlockType`
editor.unwrapCodeBlock()

// @ts-expect-error `getIndent` receives a Value, not an Editor
const badOptions: EditCodeOptions = { getIndent: (e: Editor) => '' }

void [plugins, chained, fromReact, inCode, indent, code, lines, badOptions]
