import React from 'react';

export default function renderBlock(props: *) {
  const { node, children, attributes } = props;

  switch (node.type) {
    case 'code_block':
      return (
        <div className="code" {...attributes}>
          {children}
        </div>
      );
    case 'code_line':
      return <pre {...attributes}>{children}</pre>;
    case 'paragraph':
      return <p {...attributes}>{children}</p>;
    case 'heading':
      return <h1 {...attributes}>{children}</h1>;
    default:
      return null;
  }
}

