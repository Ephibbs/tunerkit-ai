'use client';

import { useState } from 'react';
import AIChatbox from './chat-example';

const ChatBubble = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="fixed bottom-5 right-5 z-[2147483647]">
            {isOpen && <div className="fixed bottom-24 right-4">
                <AIChatbox />
            </div>
            }
            <button
                onClick={toggleChat}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full focus:outline-none shadow-lg transition duration-300 ease-in-out h-14 w-14"
                aria-label="Toggle Chat"
            >
                <span>{isOpen ? '×' : 'Chat'}</span>
            </button>
        </div>
    );
};

export default ChatBubble;