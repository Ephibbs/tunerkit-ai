'use client';
import React, { useState } from 'react';
import { getPublicClient } from 'backless-ai';

const client = getPublicClient('f5d86791-d513-48de-8fd2-b6dbdd4abe9b');

const AIDetector: React.FC = () => {
    const [text, setText] = useState<string>('');
    const [piiDetected, setPiiDetected] = useState<boolean|null>(null);
    const [explanation, setExplanation] = useState<string>('');

    const handleDetect = async () => {
        if (!text) {
            alert('Please enter some text for detection.');
            return;
        }

        try {
            // Assuming `client.getAIDetection` is a function in your API to handle detection
            const data = await client?.getCompletion({
                messages: [{ role: 'system', content: `Determine if the following text has any PII (personally identifiable information) using json output with { "explanation": <explanation of decision>, "contains_pii": true | false }. Return true if it does and false if it does: ${text}` }],
                response_format: { type: 'json_object' },
                model: 'gpt-4o-mini',
                temperature: 0.0,
            });
            const { explanation: explainer, contains_pii } = JSON.parse(data.choices[0].message.content);
            setExplanation(explainer);
            setPiiDetected(contains_pii);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Enter text to detect PII..."
                className="p-2 resize rounded border"
            />
            <button onClick={handleDetect} className="bg-blue-500 text-white p-2 rounded shadow-md">
                Detect PII
            </button>
            {piiDetected !== null && (
                <div>
                    <h3>Detection Results:</h3>
                    {
                        piiDetected ? (
                            <p>PII detected in the text.</p>
                        ) : (
                            <p>No PII detected in the text.</p>
                        )
                    }
                    {explanation && <p>Explanation: {explanation}</p>}
                </div>
            )}
        </div>
    );
};

export default AIDetector;
