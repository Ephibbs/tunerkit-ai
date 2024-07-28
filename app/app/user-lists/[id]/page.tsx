import Login from "@/app/login/page";
// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ProjectDashboard } from "@/components/project-dashboard";
import UserListTable from "@/components/user-list-table";

export const dynamic = "force-dynamic";

export default async function Index({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: userList } = await supabase
    .from("user_lists")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!userList) {
    redirect("/app/user-lists");
  }
  
  return (
    <div className="h-full mt-6 m-auto max-w-5xl w-full">
      <UserListTable object={userList.data} />
    </div>
  );
}
