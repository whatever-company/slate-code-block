# slate-code-block

A Slate plugin to handle code block editing.

This is a fork from rocketscience/slate-code-block which is a fork of tildepage/slate-code-block, which is a fork from linonetwo/slate-code-block, which is a fork from GitbookIO/slate-edit-code, ([because](https://github.com/GitbookIO/slate/blob/master/Readme.md)) for compatibility with latest Slate.

### Install

```js
yarn add @whatever-company/slate-code-block
```

### Features

- Pressing <kbd>Enter</kbd> insert a new line starting with the right indentation
- Pressing <kbd>Tab</kbd> insert the right indentation if selection is collapsed or indent all lines in selection
- Pressing <kbd>Delete</kbd> remove the indentation before cursor if possible
- Pressing <kbd>Mod+Enter</kbd> exits the code block
- Pressing <kbd>Mod+A</kbd> selects all the text in the block

> <kbd>Mod</kbd> means <kbd>Ctrl</kbd> on Windows/Linux and <kbd>Command</kbd> on Mac.

### Structure

This plugin uses the following structure for code blocks:

```html
<code_block>
  <code_line>A code block is made of</code_line>
  <code_line>several code lines</code_line>
</code_block>
```

Texts inside `code_blocks` that contain newlines `\n` are automatically split into the appropriate number of `code_lines`.

### Simple Usage

```js
import CodeBlock from '@whatever-company/slate-code-block'

const plugins = [CodeBlock()]
```

#### Options arguments

- `containerType = 'code_block' : string` — The type of the code containers
- `lineType = 'code_line' : string` — The type of the code lines
- `exitBlockType = 'paragraph' : null | string` — <kbd>Mod+Enter</kbd> will exit the code container, into the given block type. Backspace at start of an empty code container will convert it to the given block type. Pass `null` to disable this behavior.
- `onExit: (Change) => void | Change` — Change to do when the user hits <kbd>Mod+Enter</kbd>. Defaults to exiting the code block, into a new `exitBlockType` block.
- `selectAll = true : boolean` — True to select all code inside a code container on <kbd>Mod+A</kbd>
- `allowMarks = false : boolean` — False disallow marks in code blocks by normalizing them away.
- `getIndent: (Value) => string` — Returns the indent unit as a string. The current value is passed as context.

#### Suppressing onKeyDown behavior

Some behavior implemented by this plugins have no corresponding option. While there is an option `selectAll` to disable the behavior on `Mod+A`, If you would like to fine tune these behavior, you can always redefine the exported `onKeyDown` function.

The following example disable all indent behavior

```js
import CodeBlock from '@whatever-company/slate-code-block'

const options = { ... };

const basePlugin = CodeBlock(options);

const customPlugin = {
  ...basePlugin,
  onKeyDown(event, change, editor) {
    if (event.key === 'Tab') {
      // Bypass the original plugin behavior on `Tab`
      return;
    } else {
      return basePlugin.onKeyDown(event, change, editor);
    }
  }
}

// Use customPlugin later on
```

### Queries and Commands

#### `editor.getCurrentIndent`

`editor.getCurrentIndent() => String`

Returns the current indent detected.

#### `editor.deserializeCode`

`editor.deserializeCode(text: String) => Block`

Split a text string into lines, and deserialize them to a `code_container` `Block`, with one children `code_line` `Block` per line.

#### `editor.deserializeCode`

`editor.deserializeCode(text: String) => Block`

Split a text string into lines, and deserialize them to a `code_container` `Block`, with one children `code_line` `Block` per line.

#### `editor.toggleCodeBlock`

`editor.toggleCodeBlock(type: String) => Editor`

Toggle a block into a code block or a normal block (defined by `type`).

#### `editor.wrapCodeBlockByKey`

`editor.wrapCodeBlockByKey(key: String) => Editor`

Convert a block (paragraph, etc) into a code block.

#### `editor.wrapCodeBlock`

`editor.wrapCodeBlock() => Editor`

Convert current block (paragraph, etc) into a code block.

#### `editor.unwrapCodeBlockByKey`

`editor.unwrapCodeBlockByKey(key: String, type: String) => Editor`

Convert a code block into a normal block (paragraph, etc).

#### `editor.unwrapCodeBlock`

`editor.unwrapCodeBlock(type: String) => Editor`

Convert current code block into a normal block (paragraph, etc).
