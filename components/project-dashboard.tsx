'use client'
import React from 'react';
import { DataSetGenerationOptions } from './data-set-generation-options';
import { createClient } from '@/utils/supabase/client';

interface Project {
    id: string;
    name: string;
    prompt: string;
    functions: string[];
    judges: string[];
    user_list: string[];
    user_id: string;
}

interface ProjectDashboardProps {
    project: Project;
    user_lists: string[];
    tools: string[];
    judges: string[];
}

export function ProjectDashboard({ project, tools, judges, user_lists }: ProjectDashboardProps) {
    return (
        <div className="flex flex-col gap-4">
            <DataSetGenerationOptions project={project} initialToolOptions={tools || []} initialJudgeOptions={judges || []} userListOptions={user_lists || []} />
        </div>
    );
}