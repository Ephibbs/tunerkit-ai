import ClientSideModelsList from "@/components/realtime/ClientSideModelsList";
// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function Index() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return <div>User not found</div>;
  }

  const { data: projects } = await supabase
    .from("projects")
    .select(
      `*`
    );

  return (
    <>
      <ClientSideModelsList serverProjects={projects ?? []} />
    </>
  );
}
