import ClientSideModelsList from "@/components/realtime/ClientSideDatasetList";
// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import CrewAIConversation from "@/components/crew-ai-conversation";

export const dynamic = "force-dynamic";

export default async function Index() {
    const supabase = createClient();

    const { data: datasets } = await supabase
        .from("datasets")
        .select(
            `*`
        );

    return (
        <>
            <ClientSideModelsList serverProjects={datasets ?? []} />
            <CrewAIConversation />
        </>
    );
}
