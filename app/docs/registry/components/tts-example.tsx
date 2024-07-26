'use client'
import React, { useRef, useState } from 'react';
import { getPublicClient } from "backless-ai";

const client = getPublicClient('f5d86791-d513-48de-8fd2-b6dbdd4abe9b');

const SpeechGenerator: React.FC = () => {
    const [text, setText] = useState<string>('');
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Create an audio element and attach it to the ref
    if (!audioRef.current) {
        audioRef.current = new Audio();
    }

    const handleGenerateSpeech = async () => {
        if (!text) {
            alert('Please enter some text to generate speech.');
            return;
        }

        try {
            // Assuming `client.getSpeech` is an existing function that handles API requests
            const response = await client?.getSpeech({
                input: text,
                model: 'tts-1',
                voice: 'alloy'
            });

            if (!response.ok) {
                throw new Error('Failed to generate speech');
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            if (audioRef.current) {
                audioRef.current.src = url;
                audioRef.current.play().catch(err => console.error('Error playing the audio:', err));
            }
        } catch (error: any) {
            console.error('Error:', error.message);
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Enter text here..."
                className="border p-2 resize rounded"
            />
            <button onClick={handleGenerateSpeech} className="bg-blue-500 text-white p-2 rounded">
                Generate Speech
            </button>
        </div>
    );
};

export default SpeechGenerator;