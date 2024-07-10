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

const components = {

};

export default async function Index({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="w-full max-w-2xl mx-auto mt-8 flex flex-row">
            <div className="flex flex-1 flex-col gap-2 px-2 md:max-w-48">
            </div>
            <div
                id="main-content"
                className="flex flex-1 flex-col gap-2 px-2 flex-grow"
            >
                {children}
            </div>
        </div>
    );
}
