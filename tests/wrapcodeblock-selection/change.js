import assert from 'assert';

export default function(plugin, editor) {
    editor.wrapCodeBlock(editor);

    assert.equal(editor.value.selection.start.offset, 5);

    return editor;
}
