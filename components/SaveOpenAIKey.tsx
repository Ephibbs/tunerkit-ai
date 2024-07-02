'use client';
// Example using Supabase in React
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client'

const SaveOpenAIKeySection = ({projectId}: any) => {
    const [openAIKey, setOpenAIKey] = useState('');
    const supabase = createClient();

    // const handleSave = async () => {
    //     const { data, error } = await supabase.auth.getSession();
    //     if (error) {
    //         console.error(error);
    //         return;
    //     }
    //     console.log('data', data);
    //     const access_token = data?.session?.access_token;
    //     console.log('openAIKey', openAIKey, 'access_token', access_token);
    //     fetch(`/overview/users/save_openai_key`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${access_token}`
    //         },
    //         body: JSON.stringify({ openAIKey })
    //     }).then(res => res.json()).then(() => alert('Key saved successfully!')).catch(console.error);
    // };

    const handleSave = async () => {
        const { data: { user } } = await supabase.auth.getUser()

        const { data: { account_id } } = await supabase
            .from('members')
            .select('account_id')
            .eq('user_id', user.id)
            .single();

        const { error } = await supabase
            .from('projects')
            .upsert({ openai_key: openAIKey, id: projectId, account_id });
        if (error) {
            console.error('Error updating openai key:', error.message);
            return;
        }
        console.log('OpenAI key updated successfully');
    };

    useEffect(() => {
        const fetchKey = async () => {
            const { data, error } = await supabase
                .from('projects')
                .select('openai_key')
                .eq('id', projectId)
                .single();
            if (error) {
                console.error('Error fetching key:', error);
            } else {
                setOpenAIKey(data.openai_key);
            }
        };

        fetchKey();
    }, []);

    return (
        <div className="flex flex-col gap-4 w-full justify-between items-center text-center max-w-lg m-auto mb-8 py-4 bg-gray-100 rounded-lg">
            <h1 className="font-bold">1. Set your OpenAI key</h1>
            <div className="flex flex-row gap-4 items-center text-center">
                <input value={openAIKey} onChange={e => setOpenAIKey(e.target.value)} className="text-gray-900 bg-gray-300 p-2 rounded-md" />
                <button onClick={handleSave} className="text-white bg-red-500 p-2 rounded-md">Save</button>
            </div>
            <div className="text-gray-500 text-sm mx-4">
                <p>
                    Input your OpenAI key here. This key is encrypted and stored securely.
                </p>
            </div>
        </div>
    );
};

export default SaveOpenAIKeySection;
