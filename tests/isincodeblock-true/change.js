import assert from 'assert';

export default function(plugin, editor) {
    assert.equal(editor.isInCodeBlock(), true);

    return editor;
}
