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

    const { data: account_data, error } = await supabase
        .from('members')
        .select('account_id')
        .eq('user_id', user.id)
        .single();

    const account_id = account_data?.account_id;

    const { data: account } = await supabase
        .from('accounts')
        .select('*')
        .eq('account_id', account_id)
        .single();

    const openaiKey = account?.openai_key;

    const { data: project } = await supabase
        .from("projects")
        .select("*")
        .eq("id", params.id)
        .eq("account_id", account_id)
        .single();

    if (!project) {
        redirect("/app");
    }

    return (
        <div className="h-full mt-6 m-auto max-w-5xl w-full">
            <ProjectNavbar projectId={params.id} projectName={project?.name} />
            <div>
                {children}
            </div>
        </div>
    );
}
