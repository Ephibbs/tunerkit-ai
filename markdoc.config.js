import * as Markdoc from '@markdoc/markdoc';
import React from 'react';
import { ComponentPreview } from './components/component-preview';
import { Fence } from './components/code';

const components = {
  ComponentPreview: {
    render: ComponentPreview,
    attributes: {
      name: {
        type: 'string',
      },
    },
  },
};

const fence = {
  render: Fence,
  attributes: {
    language: {
      type: String,
    },
  },
};

export default {
  nodes: {
    // Custom nodes and transformations can be defined here
    fence,
  },
  tags: components,
};
