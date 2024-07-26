
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";


export async function UsageDashboard({ projectId }: { projectId: string }) {
    const supabase = createClient();

    // request count
    const { data, count } = await supabase
        .from("requests")
        .select("*", { count: 'exact' })
        .eq("project_id", projectId);

    const { data: user_count, error } = await supabase
        .rpc('count_distinct_users', { input_project_id: projectId });

    if (error) {
        console.error(error);
    }

    return (
        <div className="flex flex-col gap-4 m-auto rounded-md p-4 max-w-6xl w-full overflow-hidden">
            <div className="flex flex-row gap-4">
                <div className="border rounded-md p-4 flex flex-col gap-4 w-36">
                    <h3 className="text-sm text-gray-500">Total Requests:</h3>
                    <p className="text-bold text-black text-center text-3xl">{count}</p>
                </div>
                <div className="border rounded-md p-4 flex flex-col gap-4 w-36">
                    <h3 className="text-sm text-gray-500">Users: </h3>
                    <p className="text-bold text-black text-center text-3xl">{user_count}</p>
                </div>
            </div>
        </div>
    );
}
