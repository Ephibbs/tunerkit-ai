'use client';
// Example using Supabase in React
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client'
import { getAccessToken } from '@/utils/account-helpers';
import Link from 'next/link';

const SaveOpenAIKeySection = ({projectId}: any) => {
    const [openAIKey, setOpenAIKey] = useState('');
    const [isOpenAIKeySaved, setIsOpenAIKeySaved] = useState(false);
    const [account_id, setAccountId] = useState('');
    const supabase = createClient();

    const handleDelete = async () => {
        console.log('handleDelete');
        await handleSave(true);
    }

    const handleSave = async (shouldDelete=false) => {
        // const { error } = await supabase
        //     .from('projects')
        //     .update({ openai_key: openAIKey, id: projectId })
        //     .eq('id', projectId);
        const key = shouldDelete ? null : openAIKey;
        console.log('key', key);
        const jwt = await getAccessToken(supabase)
        fetch(`/api/accounts/openai_key`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            },
            body: JSON.stringify({
                openAIKey: key
            })
        })
        .then(response => response.json())
        .then(data => {
            setOpenAIKey('');
            setIsOpenAIKeySaved(!shouldDelete);
            console.log('OpenAI key updated successfully');
        })
        .catch(error => console.error('Error fetching key:', error));

        // if (error) {
        //     console.error('Error updating openai key:', error.message);
        //     return;
        // }
        // console.log('OpenAI key updated successfully');
    };

    useEffect(() => {
        const fetchKey = async () => {
            const jwt = await getAccessToken(supabase)
            fetch(`/api/accounts/openai_key`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`
                }
            })
                .then(response => response.json())
                .then(data => {
                    setIsOpenAIKeySaved(data.openai_key_set);
                })
                .catch(error => console.error('Error fetching key:', error));
        };
        fetchKey();
        fetch(`/api/openai`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => console.log('response', response))
            .catch(error => console.error('Error fetching key:', error));
    }, []);

    return (
        <div className="flex flex-col gap-4 w-full justify-between items-center text-center max-w-lg m-auto mb-8 py-4 bg-gray-100 rounded-lg">
            <h1 className="font-bold">1. Set your OpenAI key</h1>
            <div className="flex flex-row gap-4 items-center text-center">
                <input value={openAIKey} onChange={e => setOpenAIKey(e.target.value)} className="text-gray-900 bg-gray-300 p-2 rounded-md" />
                <button onClick={()=>handleSave()} className="text-white bg-red-500 p-2 rounded-md">Save</button>
            </div>
            {isOpenAIKeySaved && <div className="flex flex-row gap-4 items-center text-center">
                                    <p className="text-gray-500">OpenAI key saved</p>
                <button onClick={handleDelete} className="text-red-500 hover:text-red-700 transition-colors">
                                        <svg width="12" height="12" viewBox="0 0 24 24" className="fill-current">
                                            <path d="M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z" />
                                        </svg>
                                    </button>
                                </div>    
            }
            <div className="text-gray-500 text-sm mx-4">
                <p>
                    Input your OpenAI key here. This key is encrypted and stored securely.
                </p>
                <Link href="https://platform.openai.com/account/api-keys" className="text-blue-500 hover:underline">
                    Get your OpenAI key here.
                </Link>
            </div>
        </div>
    );
};

export default SaveOpenAIKeySection;
