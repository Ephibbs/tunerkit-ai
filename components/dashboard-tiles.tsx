'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Settings, Users, Activity, Database, LucideIcon } from 'lucide-react';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import Link from 'next/link';

interface Project {
    id: string;
    // Add other project properties as needed
}

interface TileProps {
    title: string;
    icon: LucideIcon;
    children: React.ReactNode;
    className?: string;
}

// interface CopyableCodeProps {
//     code: string;
// }

// interface DashboardTilesProps {
//     project: Project;
// }

export const Tile: React.FC<TileProps> = ({ title, icon: Icon, children, className }) => {
    return (
        <div className={`bg-white shadow-lg rounded-lg overflow-hidden w-full mb-4 ${className}`}>
            <div className="flex items-center p-4 bg-gray-100">
                <Icon className="mr-2" size={24} />
                <h2 className="text-lg font-semibold">{title}</h2>
            </div>
            <div className="p-4">
                {children}
            </div>
        </div>
    );
};

// const CopyableCode: React.FC<CopyableCodeProps> = ({ code }) => {
//     const [copied, setCopied] = useState(false);

//     const copyToClipboard = () => {
//         navigator.clipboard.writeText(code);
//         setCopied(true);
//         setTimeout(() => setCopied(false), 2000);
//     };

//     return (
//         <div className="relative bg-gray-100 p-2 rounded mb-2">
//             <pre className="text-sm overflow-x-auto">
//                 <code>{code}</code>
//             </pre>
//             <button
//                 onClick={copyToClipboard}
//                 className="absolute top-2 right-2 text-blue-500 hover:text-blue-700"
//             >
//                 <Copy size={18} />
//             </button>
//             {copied && (
//                 <Alert className="mt-2">
//                     <AlertDescription>Copied to clipboard</AlertDescription>
//                 </Alert>
//             )}
//         </div>
//     );
// };

// const DashboardTiles: React.FC<DashboardTilesProps> = ({ project }) => {
//     return (
//         <div className="max-w-2xl mx-auto p-4">
//             <Tile title="Import the NPM Package" icon={Database}>
//                 <h3 className="font-medium mb-2">Use your project ID</h3>
//                 <CopyableCode code={project.id} />

//                 <h3 className="font-medium mb-2">Import the package</h3>
//                 <CopyableCode code="npm i backless-ai" />

//                 <h3 className="font-medium mb-2">Usage example</h3>
//                 <CopyableCode code={`import { OpenAIClient } from 'backless-ai';\n\nconst openai = OpenAIClient('${project.id}');`} />

//                 <p className="text-sm text-gray-600 mt-2">
//                     Use this key in your frontend javascript to get started!
//                 </p>
//                 <Link href="/docs" className="text-blue-500 hover:underline text-sm">
//                     Learn more
//                 </Link>
//             </Tile>

//             <Tile title="Set User Controls" icon={Settings}>
//                 <h3 className="font-medium mb-2">User Authentication</h3>
//                 <p className="text-sm text-gray-600 mb-4">Configure user authentication settings here.</p>

//                 <h3 className="font-medium mb-2">User Limit</h3>
//                 <p className="text-sm text-gray-600 mb-4">Set rate limits for individual users.</p>

//                 <h3 className="font-medium mb-2">Project Limit</h3>
//                 <p className="text-sm text-gray-600 mb-4">Set overall project rate limits.</p>
//             </Tile>

//             <Tile title="Explore Pre-built AI Apps" icon={Activity}>
//                 <p className="text-sm text-gray-600 mb-2">
//                     Discover our collection of pre-built AI apps and features to enhance your project.
//                 </p>
//                 <Link href="/components" className="text-blue-500 hover:underline text-sm">
//                     Learn more
//                 </Link>
//             </Tile>

//             <Tile title="Monitor Usage" icon={Users}>
//                 <p className="text-sm text-gray-600 mb-2">
//                     View usage and request logs in your dashboard split by project and user.
//                 </p>
//                 <Link href={`/app/projects/${project.id}/requests`} className="text-blue-500 hover:underline text-sm">
//                     View logs
//                 </Link>
//             </Tile>
//         </div>
//     );
// };

// export default DashboardTiles;