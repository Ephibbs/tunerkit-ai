import Login from "@/app/login/page";
// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ProjectDashboard } from "@/components/project-dashboard";

export const dynamic = "force-dynamic";

export default async function Index({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!project) {
    redirect("/app");
  }

  const user_lists_promise = supabase.from('user_lists').select('id,name').eq('user_id', project.user_id).then(data => data.data) as Promise<string[]>;
  const tools_promise = supabase.from('tools').select('*').eq('user_id', project.user_id).then(data => data.data) as Promise<string[]>;
  const judges_promise = supabase.from('judges').select('*').eq('user_id', project.user_id).then(data => data.data) as Promise<string[]>;

  const [user_lists, tools, judges] = await Promise.all([user_lists_promise, tools_promise, judges_promise]);
  
  return (
    <ProjectDashboard project={project} user_lists={user_lists} tools={tools} judges={judges} />
  );
}
