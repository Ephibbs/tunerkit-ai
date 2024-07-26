import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark, stackoverflowDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export function Fence({ children, language="javascript" }: any) {
    // const codeString = '(num) => num + 1';
    return (
        <SyntaxHighlighter language={language} style={stackoverflowDark}>
            {children}
        </SyntaxHighlighter>
    );
}