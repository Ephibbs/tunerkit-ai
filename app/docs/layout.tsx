import NewProjectZone from "@/components/NewProjectZone";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import Aside from "./components/aside";

const components = {

};

export default async function Index({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="w-full max-w-7xl mx-auto flex flex-row">
            <Aside/>
            <div
                id="main-content"
                className="flex flex-1 flex-col gap-2 flex-grow pt-20"
            >
                {children}
            </div>
        </div>
    );
}
