import Login from "@/app/login/page";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ProjectNavbar } from "@/components/ui/project-navbar";

export const dynamic = "force-dynamic";

export default async function Index({ params, children }: { params: { id: string }, children: React.ReactNode }) {
    if (!params.id) {
        redirect("/app");
    }
    const supabase = createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return <Login />;
    }

    const { data: userList } = await supabase
        .from("user_lists")
        .select("*")
        .eq("id", params.id)
        .single();

    if (!userList) {
        redirect("/app");
    }

    return (
        <div className="h-full mt-6 m-auto max-w-5xl w-full">
            <ProjectNavbar projectId={params.id} projectName={userList?.name} />
            <div>
                {children}
            </div>
        </div>
    );
}
