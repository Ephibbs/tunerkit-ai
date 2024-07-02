'use client';

import React, { useState } from 'react';

export default function CodeBlock({children, className, copyText}: {children: React.ReactNode, className?: string, copyText: string}) {
    const [isCopied, setIsCopied] = useState(false);

    function copyToClipboard() {
        navigator.clipboard.writeText(copyText);
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 2000); // Revert back after 2 seconds
    }

    return (
        <code className={`inline-flex text-left items-center space-x-4 bg-gray-800 text-white rounded-lg p-4 pl-6 ${className}`}>
            <span className="flex gap-4">
                {children}
            </span>
            <svg className="shrink-0 h-5 w-5 transition text-gray-500 hover:text-white cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                onClick={copyToClipboard}
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true">
                {isCopied ? (
                    // Checkmark SVG Path
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                ) : (
                    // Original SVG Paths
                    <>
                        <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z"></path>
                        <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z"></path>
                    </>
                )}
            </svg>
        </code>
    );
}
