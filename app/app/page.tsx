import ClientSideModelsList from "@/components/realtime/ClientSideModelsList";
// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { ProjectDashboard } from "@/components/project-dashboard";

export const dynamic = "force-dynamic";

export default async function Index() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const user_id = user?.id;
  const user_lists_promise = supabase.from('user_lists').select('id,name').eq('user_id', user_id).then(data => data.data) as Promise<string[]>;
  const tools_promise = supabase.from('tools').select('*').eq('user_id', user_id).then(data => data.data) as Promise<string[]>;
  const judges_promise = supabase.from('judges').select('*').eq('user_id', user_id).then(data => data.data) as Promise<string[]>;

  const [user_lists, tools, judges] = await Promise.all([user_lists_promise, tools_promise, judges_promise]);
  return (
    <>
      {/* <ClientSideModelsList serverProjects={projects ?? []} /> */}
      <ProjectDashboard user_lists={user_lists} tools={tools} judges={judges} />
    </>
  );
}
