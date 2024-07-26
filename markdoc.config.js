import * as Markdoc from '@markdoc/markdoc';
import React from 'react';
import { ComponentPreview } from './components/component-preview';
import CodeBlock from './components/ui/code-block';

const components = {
  ComponentPreview: {
    render: ComponentPreview,
    attributes: {
      name: {
        type: 'string',
      },
    },
  },
  CodeBlock: {
    render: CodeBlock,
    attributes: {
        language: {
            type: String,
        },
        content: { type: String },
    },
  }
};

export default {
  nodes: {
    fence: {
      render: CodeBlock,
      attributes: {
        language: {
          type: String,
        },
        content: { type: String },
      },
    },
  },
  tags: components,
};
