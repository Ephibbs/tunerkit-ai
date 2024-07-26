import Login from "@/app/login/page";
// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ProjectDashboard } from "@/components/project-dashboard";

export const dynamic = "force-dynamic";

export default async function Index({ params }: { params: { id: string } }) {
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
    <ProjectDashboard project={project} />
  );
}
