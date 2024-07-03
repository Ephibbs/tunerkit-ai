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
        <div className="w-full max-w-2xl mx-auto mt-8">
            <div
                id="train-model-container"
                className="flex flex-1 flex-col gap-2 px-2"
            >
                <Link href="/app" className="text-sm w-fit">
                    <Button variant={"outline"}>
                        <FaArrowLeft className="mr-2" />
                        Go Back
                    </Button>
                </Link>
                <Card>
                    <CardHeader>
                        <CardTitle>New Project</CardTitle>
                        <CardDescription>
                            Choose a name to get started.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <NewProjectZone />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
