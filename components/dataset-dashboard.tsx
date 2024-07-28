// File: components/DatasetDashboardClient.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { createClient } from "@/utils/supabase/client";

type Message = {
    role: string;
    content: string;
};

type Datarow = {
    id: string;
    data: Message[];
    user: Record<string, any>;
};

type Dataset = {
    name: string;
};

interface DatasetDashboardClientProps {
    dataset: Dataset;
    initialDatarows: Datarow[];
    datasetId: string;
}

export function DatasetDashboardClient({ dataset, initialDatarows, datasetId }: DatasetDashboardClientProps) {
    const [datarows, setDatarows] = useState<Datarow[]>(initialDatarows);
    const [selectedRow, setSelectedRow] = useState<Datarow | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const channel = supabase
            .channel('datarows_changes')
            .on<Datarow>(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'datarows',
                    filter: `dataset_id=eq.${datasetId}`
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setDatarows(prev => [...prev, payload.new]);
                    } else if (payload.eventType === 'UPDATE') {
                        setDatarows(prev => prev.map(row => row.id === payload.new.id ? payload.new : row));
                    } else if (payload.eventType === 'DELETE') {
                        setDatarows(prev => prev.filter(row => row.id !== payload.old.id));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [datasetId, supabase]);

    console.log(datarows);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{dataset.name}</h1>
            <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-2/3">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 border-b">ID</th>
                                <th className="py-2 px-4 border-b">User Info</th>
                                <th className="py-2 px-4 border-b">Messages Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datarows.map(row => (
                                <tr
                                    key={row.id}
                                    onClick={() => setSelectedRow(row)}
                                    className="cursor-pointer hover:bg-gray-50"
                                >
                                    <td className="py-2 px-4 border-b">{row.id}</td>
                                    <td className="py-2 px-4 border-b">{JSON.stringify(row.user)}</td>
                                    <td className="py-2 px-4 border-b">{row.data.length}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="w-full md:w-1/3">
                    {selectedRow && (
                        <div className="bg-white border border-gray-300 p-4">
                            <h2 className="text-xl font-semibold mb-2">Messages</h2>
                            {selectedRow.data.map((message, index) => (
                                <div key={index} className="mb-2 p-2 bg-gray-50 rounded">
                                    <p className="font-semibold">{message.role}</p>
                                    <p>{message.content}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}