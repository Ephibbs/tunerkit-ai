'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {Button} from '@/components/ui/button';

const CrewAIConversation = () => {
    const [conversation, setConversation] = useState('');
    const [loading, setLoading] = useState(false);

    const simulateConversation = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/generate-dataset', {
                method: 'GET',
            });
            const data = await response.json();
            setConversation(data.conversation);
        } catch (error) {
            console.error('Error:', error);
            setConversation('An error occurred while simulating the conversation.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto mt-8">
            <CardHeader>
                <h1>
                    CrewAI Conversation Simulator
                </h1>
            </CardHeader>
            <CardContent>
                <Button
                    onClick={simulateConversation}
                    disabled={loading}
                    className="mb-4"
                >
                    {loading ? 'Simulating...' : 'Simulate Conversation'}
                </Button>
                {conversation && (
                    <h1 className="whitespace-pre-wrap">
                        {conversation}
                    </h1>
                )}
            </CardContent>
        </Card>
    );
};

export default CrewAIConversation;