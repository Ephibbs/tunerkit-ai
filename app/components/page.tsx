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

export default async function Index() {
    return (
        <div className="w-full max-w-2xl mx-auto mt-8 flex flex-row">
            <div id="side-bar" className="w-1/4">
                <Link href="/app" className="text-sm w-fit">
                    <Button variant={"outline"}>
                        <FaArrowLeft className="mr-2" />
                        Go Back
                    </Button>
                </Link>
            </div>
            <div
                id="main-content"
                className="flex flex-1 flex-col gap-2 px-2 w-3/4"
            >
                
            </div>
        </div>
    );
}
