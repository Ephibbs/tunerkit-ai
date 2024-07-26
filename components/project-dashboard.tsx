'use client'
import React from 'react';
import SaveOpenAIKeySection from "@/components/SaveOpenAIKey";
import Link from "next/link";
import UserAuthPicker from "@/components/ui/user-auth-picker";
import { RateLimitSetter } from "@/components/rate-limit-setter";
import CodeBlock from "@/components/ui/code-block";
import CORSManagement from "@/components/cors-management";
import { Tile } from "@/components/dashboard-tiles";
import { Settings, Users, Activity, Database, Goal } from 'lucide-react';
import { MarqueeDemo } from "@/components/components-marquee";
import { UsageDashboard } from "@/components/usage-dashboard";

interface Project {
    id: string;
    user_rate_limit: number;
    user_rate_period: string;
    rate_limit: number;
    rate_period: string;
}

interface ProjectDashboardProps {
    project: Project;
}

export function ProjectDashboard({ project }: ProjectDashboardProps) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-4 w-full">
                <Tile title="Get Started" icon={Goal} className='w-1/2'>
                    <div className="flex flex-col gap-4 items-center text-center">
                        <h2 className="font-bold">Use your project ID</h2>
                        <CodeBlock className="text-sm w-full" copyText={project.id} language="plaintext">
                            {project.id}
                        </CodeBlock>
                        <p className="text-gray-500 text-sm">
                            Use this key in your frontend javascript to get started!
                        </p>
                        <h2 className="font-bold">Import the package</h2>
                            <CodeBlock copyText={'npm i backless-ai'} className="text-sm w-full" language="bash">
                            npm i backless-ai
                        </CodeBlock>
                            <CodeBlock className="text-sm w-full" copyText={`import { OpenAIClient } from 'backless-ai';\n\nconst openai = OpenAIClient('${project.id}');`} language="javascript">
                            {`import { OpenAIClient } from 'backless-ai';
const openai = OpenAIClient('${project.id}');`}
                        </CodeBlock>
                    </div>
                </Tile>
                <Tile title="Usage" icon={Activity} className='w-1/2'>
                    <div className="flex flex-col gap-4 items-center text-center">
                        <UsageDashboard projectId={project.id} />
                        <p className="text-gray-500 text-sm">
                            View usage and request logs in your dashboard split by project and user.
                            <br />
                            <Link href={`/app/projects/${project.id}/requests`} className="text-blue-500 hover:underline">
                                Learn more
                            </Link>
                        </p>
                    </div>
                </Tile>
            </div>
            <div className="flex gap-4 w-full">
                <Tile title="User Authentication" icon={Users} className='w-1/2'>
                    <div className="flex flex-col gap-4 items-center text-center p-2">
                        <UserAuthPicker project={project} />
                    </div>
                </Tile>

                <Tile title="Set Limits" icon={Users} className='w-1/2'>
                    <div className="flex flex-col gap-4 items-center text-center">
                        {/* <h2 className="font-bold">User Limit</h2> */}
                        <RateLimitSetter title={'User Limit'} projectId={project.id} rateLimit={project.user_rate_limit} ratePeriod={project.user_rate_period} type={'project_user'} unit={'cents'} />
                        {/* <h2 className="font-bold">Project Limit</h2> */}
                        <RateLimitSetter title={'Project Limit'} projectId={project.id} rateLimit={project.rate_limit} ratePeriod={project.rate_period} type={'project'} unit={'cents'} />
                    </div>
                </Tile>
            </div>
            <div className="flex gap-4 w-full">
            <Tile title="Manage CORS Domains" icon={Settings} className='w-1/2'>
                <CORSManagement projectId={project.id as string} />
            </Tile>

            <Tile title="Explore AI Apps" icon={Database} className='w-1/2'>
                <div className="flex flex-col gap-4 items-center text-center">
                    <h2 className="font-bold">Pre-built AI apps and features</h2>
                    <MarqueeDemo />
                    <p className="text-gray-500 text-sm">
                        Explore our collection of AI-powered applications and features.
                        <br />
                        <Link href="/components" className="text-blue-500 hover:underline">
                            Learn more
                        </Link>
                    </p>
                </div>
            </Tile>
            </div>
        </div>
    );
}