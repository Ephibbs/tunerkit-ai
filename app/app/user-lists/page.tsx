import ClientSideModelsList from "@/components/realtime/ClientSideUserList";
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

    const { data: user_lists } = await supabase
        .from("user_lists")
        .select(
            `*`
        );

    return (
        <>
            <ClientSideModelsList serverProjects={user_lists ?? []} />
        </>
    );
}
