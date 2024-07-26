import fs from 'fs';
import path from 'path';
import * as Markdoc from '@markdoc/markdoc';
import markdocConfig from '../../../markdoc.config';
import React from 'react';
import yaml from 'js-yaml';
import '../docs.css';
import CodeBlock from '@/components/ui/code-block';


function getContent({ params }: any) {
    // Construct the file path for the markdown file based on the slug
    params.slug = params.slug || 'index';
    const slug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug;
    const filePath = path.join(process.cwd(), 'app', 'docs', 'content', `${slug}.mdx`);
    // Read the markdown file content
    const source = fs.readFileSync(filePath, 'utf-8');
    // Parse the markdown content into an AST (Abstract Syntax Tree)
    const ast = Markdoc.parse(source) as any;

    const frontmatter = ast.attributes.frontmatter
        ? yaml.load(ast.attributes.frontmatter)
        : {};
    // Transform the AST into a Markdoc content structure
    const content = Markdoc.transform(ast, markdocConfig as any);
    // Return the content as props for the component
    return { content, frontmatter };
}

// The DocPage component receives the content and renders it using Markdoc's React renderer
export default function DocPage({ params }: any) {
    const { content, frontmatter }: any = getContent({ params });
    // Render the transformed Markdoc content as React components
    return <div className='p-4'>
        <h1 className="text-4xl font-bold pb-2">
            {frontmatter.title}
        </h1>
        <p className='text-lg text-gray-500 pb-2'>
            {frontmatter.description}
        </p>
        <div className='prose max-w-3xl'>
            {Markdoc.renderers.react(content, React)}
        </div>
        </div>;
}
