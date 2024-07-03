'use client';
// Example using Supabase in React
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link';

const SaveOpenAIKeySection = ({projectId}: any) => {
    const [openAIKey, setOpenAIKey] = useState('');
    const [account_id, setAccountId] = useState('');
    const supabase = createClient();

    // useEffect(async () => {
    //     const { data: { user } } = await supabase.auth.getUser()

    //     if (!user) {
    //         return;
    //     }
    //     const fetchAccountId = async () => {
    //         const { data: { account_id }, error } = await supabase
    //             .from('members')
    //             .select('account_id')
    //             .eq('user_id', user.id)
    //             .single();

    //         if (error) {
    //             console.error('Error fetching account ID:', error);
    //         } else {
    //             setAccountId(account_id);
    //         }
    //     };

    //     await fetchAccountId();
    // }, []);

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
        // const { error } = await supabase
        //     .from('projects')
        //     .upsert({ openai_key: openAIKey, id: projectId, account_id });
        const { error } = await supabase
            .from('accounts')
            .update({ openai_key: openAIKey })
            .eq('id', account_id);

        if (error) {
            console.error('Error updating openai key:', error.message);
            return;
        }
        console.log('OpenAI key updated successfully');
    };

    useEffect(() => {
        const fetchAccountId = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            const { data: { account_id }, error } = await supabase
                .from('members')
                .select('account_id')
                .eq('user_id', user?.id)
                .single();

            if (error) {
                console.error('Error fetching account ID:', error);
            } else {
                setAccountId(account_id);
                return account_id;
            }
        };

        const fetchKey = async () => {
            // const { data, error } = await supabase
            //     .from('projects')
            //     .select('openai_key')
            //     .eq('id', projectId)
            //     .single();
            const account_id = await fetchAccountId();
            const { data, error } = await supabase
                .from('accounts')
                .select('openai_key')
                .eq('id', account_id)
                .single();
            if (error) {
                console.error('Error fetching key:', error);
            } else {
                setOpenAIKey(data.openai_key);
                setAccountId(account_id);
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
                <Link href="https://platform.openai.com/account/api-keys" className="text-blue-500 hover:underline">
                    Get your OpenAI key here.
                </Link>
            </div>
        </div>
    );
};

export default SaveOpenAIKeySection;
