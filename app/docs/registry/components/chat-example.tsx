'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChatCompletionRequest, getPublicClient } from "backless-ai";

const client = getPublicClient('f5d86791-d513-48de-8fd2-b6dbdd4abe9b');



const AIChatbox = ({ title = "Assistant", prompt = "You are a friendly assistant.", startMessages = [], useStreaming = true }) => {
    const allStartMessages = [
        { content: prompt, role: "system", id: 0 },
        { content: "Hello! I am an AI assistant.", role: "assistant", id: 0 },
        ...startMessages
    ];
    const [messages, setMessages] = useState(allStartMessages);
    const [userInput, setUserInput] = useState('');
    const chatEndRef: any = useRef(null);
    const [error, setError] = useState<string | null>(null);
    const timerRef: any = useRef(null);
    const chatContainerRef: any = useRef(null);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            const isScrollable =
                chatContainerRef.current.scrollHeight > chatContainerRef.current.clientHeight;

            if (isScrollable) {
                chatContainerRef.current.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleInputChange = (e: any) => {
        setUserInput(e.target.value);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!userInput.trim()) return;

        const newMessage = { content: userInput, role: 'user' };
        setMessages((prevMessages: any) => [...prevMessages, newMessage]);

        const requestBody = {
            model: 'gpt-3.5-turbo',
            // model: 'gpt-4-turbo',
            messages: [{ role: 'system', content: 'You are a helpful assistant.' }, ...messages, newMessage],
        } as ChatCompletionRequest;
        let tempMessageId: any = null;
        try {
            setUserInput(''); // Reset input field after sending
            if (useStreaming) {
                // Add a temporary message that will be updated by the stream
                tempMessageId = new Date().getTime(); // Create a unique ID for the temporary message
                setMessages(prevMessages => [...prevMessages, { id: tempMessageId, content: '', role: 'assistant' }]);

                await client?.getCompletionStream(requestBody, (streamData) => {
                    console.log('Stream data:', streamData);
                    setMessages(prevMessages => prevMessages.map(msg =>
                        msg.id === tempMessageId ? { ...msg, content: msg.content + streamData } : msg
                    ));
                });
            } else {
                // Using the non-streaming function
                const response = await client?.getCompletion(requestBody);
                if (response && response.choices && response.choices.length > 0) {
                    const aiText = response.choices[0].message.content;
                    setMessages((prevMessages: any) => [...prevMessages, { content: aiText, role: 'assistant' }]);
                }
            }
        } catch (error) {
            console.error("Error fetching AI response:", error);
            setError('Error fetching AI response');
            //remove the temporary message
            if (tempMessageId) {
                setMessages(prevMessages => prevMessages.filter(msg => msg.id !== tempMessageId));
            }
        }
    };

    // const generateTitle = async () => {
    //     try {
    //         const prompt = "Create a short 3-7 word title for the topic of the following conversation:\n\n" + messages.map(message => {
    //             return message.role + "\n" + message.content
    //         }).join('\n\n') + "\n\nTitle (no quotes): ";
    //         const response = await client?.getCompletion({
    //             model: 'gpt-3.5-turbo',
    //             messages: [{ role: 'system', content: prompt }]
    //         });
    //         if (response && response.choices && response.choices.length > 0) {
    //             setTitle(response.choices[0].message.content);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching AI response:", error);
    //         setTitle('Conversation');
    //     }
    // };

    // // Generate title for conversation when there is three messages
    // useEffect(() => {
    //     // Clear any existing timer to reset the countdown
    //     if (timerRef.current) {
    //         clearTimeout(timerRef.current);
    //     }

    //     // Set a new timer every time `messages` changes
    //     timerRef.current = setTimeout(() => {
    //         if (messages.length === 3) {
    //             generateTitle();
    //         }
    //     }, 1000);  // Set timeout for 1 second

    //     // Cleanup function to clear the timer when the component unmounts or before re-running the effect
    //     return () => {
    //         if (timerRef.current) {
    //             clearTimeout(timerRef.current);
    //         }
    //     };
    // }, [messages]);

    return (
        <div className="p-4 w-96 max-w-full mx-auto bg-white rounded-xl shadow-lg flex flex-col border overflow-hidden">
            <span className="text-xl font-bold mb-2">{title}</span>
            <div className="mb-4 flex-grow overflow-auto h-96 relative" ref={chatContainerRef}>
                {messages.map((message, index) => {
                    if (message.role === 'system') {
                        return null;
                    }
                    if (message.content === '') {
                        return (
                            <div className="animate-pulse h-4 bg-gray-300 w-1/2 rounded" />
                        );
                    }
                    return (
                    <div key={index} className={`p-2 rounded my-2 w-fit max-w-[80%] ${message.role === 'user' ? 'bg-blue-200 ml-auto' : 'bg-gray-200'}`}>
                        {message.content}
                    </div>
                )})}
                <div ref={chatEndRef} />
                {error && <div className="text-red-500 text-sm mt-2 absolute bottom-1">{error}</div>}
            </div>
            <form onSubmit={handleSubmit} className="flex items-end w-full">
                <input
                    type="text"
                    value={userInput}
                    onChange={handleInputChange}
                    className="flex-grow p-2 border rounded min-w-0"
                    placeholder="Type your message here..."
                />
                <button type="submit" className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none">
                    Send
                </button>
            </form>
        </div>
    );
};

export default AIChatbox;