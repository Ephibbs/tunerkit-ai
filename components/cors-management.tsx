'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

const CORSManagement = ({ projectId }: { projectId: string }) => {
    const [corsDomain, setCorsDomain] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [domains, setDomains] = useState<string[]>([]);
    const supabase = createClient();

    useEffect(() => {
        fetchDomains();
    }, []);

    const fetchDomains = async () => {
        const { data, error } = await supabase
            .from('projects')
            .select('cors_domains')
            .eq('id', projectId)
            .single();

        if (error) {
            console.error('Error fetching domains:', error);
        } else {
            setDomains(data.cors_domains || []);
        }
    };

    const isValidDomain = (domain : string) => {
        // Updated regex to allow localhost and IP addresses
        const pattern = /^(https?:\/\/)?(([\da-z.-]+)\.([a-z.]{2,6})|localhost|(\d{1,3}\.){3}\d{1,3})(:[0-9]{1,5})?$/;
        return pattern.test(domain);
    };

    const handleSave = async () => {
        if (!corsDomain) {
            setError('Please enter a domain.');
            return;
        }

        if (!isValidDomain(corsDomain)) {
            setError('Please enter a valid domain.');
            return;
        }

        setError('');
        const updatedDomains = [...domains, corsDomain];

        const { error } = await supabase
            .from('projects')
            .update({ cors_domains: updatedDomains })
            .eq('id', projectId);

        if (error) {
            console.error('Error updating domains:', error.message);
            alert(`Error: ${error.message}`);
        } else {
            setDomains(updatedDomains);
            setCorsDomain('');
            console.log('Domain added successfully.');
        }
    };

    const handleDelete = async (domainToDelete: string) => {
        const updatedDomains = domains.filter(domain => domain !== domainToDelete);

        const { error } = await supabase
            .from('projects')
            .update({ cors_domains: updatedDomains })
            .eq('id', projectId);

        if (error) {
            console.error('Error deleting domain:', error.message);
            alert(`Error: ${error.message}`);
        } else {
            setDomains(updatedDomains);
            console.log('Domain deleted successfully.');
        }
    };

    return (
        <div className="flex flex-col gap-4 w-full justify-between items-center text-center max-w-lg m-auto mb-8 py-4 rounded-lg">
            <div className="flex flex-row gap-4 items-center text-center">
                <input
                    value={corsDomain}
                    onChange={e => setCorsDomain(e.target.value)}
                    placeholder="Enter new CORS domain (e.g., https://example.com)"
                    className="text-gray-900 p-2 rounded-md border "
                />
                <button onClick={handleSave} className="text-white bg-green-500 p-2 rounded-md">Add Domain</button>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {domains.length > 0 && (
                <div className="mt-2">
                    <h2 className="font-bold mb-2">Your CORS Domains:</h2>
                    <ul>
                        {domains.map(domain => (
                            <li key={domain} className="flex justify-between items-center bg-white p-2 rounded-md gap-2">
                                {domain}
                                <button onClick={() => handleDelete(domain)} className="text-red-500 hover:text-red-700 transition-colors">
                                    <svg width="12" height="12" viewBox="0 0 24 24" className="fill-current">
                                        <path d="M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z" />
                                    </svg>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CORSManagement;
