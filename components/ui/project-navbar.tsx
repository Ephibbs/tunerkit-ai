'use client';
import { Button } from "@/components/ui/button";
import { usePathname } from 'next/navigation'
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export const ProjectNavbar = ({projectName, projectId}: {projectName: string, projectId: string}) => {
    const pathname = usePathname()
    console.log(pathname)
    return <div className="flex flex-row gap-4">
        <Link href="/app" className="text-xs w-fit">
            <Button variant={"outline"} className="text-xs" size="sm">
                <FaArrowLeft className="mr-2" />
                Go Back
            </Button>
        </Link>
        <div className="flex flex-row gap-2 align-middle text-center items-center pb-4">
            <h1 className="text-xl">{projectName}</h1>
            <div className="lg:flex flex-row gap-2">
                <Link href={`/app/projects/${projectId}`} className={`${pathname === `/app/projects/${projectId}` ? "text-blue-500" : ""}`}>
                    <Button variant={"ghost"}>Dashboard</Button>
                </Link>
                <Link href={`/app/projects/${projectId}/requests`} className={`${pathname === `/app/projects/${projectId}/requests` ? "text-blue-500" : ""}`}>
                    <Button variant={"ghost"}>Requests</Button>
                </Link>
                <Link href={`/app/projects/${projectId}/settings`} className={`${pathname === `/app/projects/${projectId}/settings` ? "text-blue-500" : ""}`}>
                    <Button variant={"ghost"}>
                        Settings
                    </Button>
                </Link>
            </div>
        </div>
    </div>
}