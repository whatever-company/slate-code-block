/** @jsx hyperscript */
import hyperscript from '../hyperscript' // eslint-disable-line

export default (
  <value>
    <document>
      <code_block>
        <code_line>Line 1</code_line>
      </code_block>
      <paragraph>
        <text />
      </paragraph>
      <code_block>
        <code_line>
          {'    '}
          Line 2
        </code_line>
      </code_block>
    </document>
  </value>
)
