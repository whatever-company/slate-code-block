// @flow
/* eslint-disable import/no-extraneous-dependencies */
/* global document */
import React from 'react';
import ReactDOM from 'react-dom';
import { Editor } from 'slate-react';
import PluginEditCode from '../lib/';

import INITIAL_VALUE from './value';
import renderBlock from './renderBlock';

const plugin = PluginEditCode();
const plugins = [plugin];


class Example extends React.Component<*, *> {
  state = {
    value: INITIAL_VALUE
  };

  ref = editor => {
    this.editor = editor
  }

  onChange = ({ value }) => {
    this.setState({
      value
    });
  };

  onToggleCode = () => {
    const { value } = this.state;

    this.onChange(
      plugin.changes.toggleCodeBlock(this.editor, 'paragraph').focus()
    );
  };

  render() {
    const { value } = this.state;

    return (
      <div>
        <button onClick={this.onToggleCode}>
          {plugin.utils.isInCodeBlock(value)
              ? 'Paragraph'
              : 'Code Block'}
        </button>
        <Editor
          placeholder={'Enter some text...'}
          plugins={plugins}
          value={value}
          ref={this.ref}
          onChange={this.onChange}
          renderBlock={renderBlock}
        />
      </div>
    );
  }
}

// $FlowFixMe
ReactDOM.render(<Example />, document.getElementById('example'));
