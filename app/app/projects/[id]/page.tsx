import Login from "@/app/login/page";
import { Icons } from "@/components/icons";
import ClientSideModel from "@/components/realtime/ClientSideModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Database } from "@/types/supabase";
// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import SaveOpenAIKeySection from "@/components/SaveOpenAIKey";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import UserAuthPicker from "@/components/ui/user-auth-picker";
import { redirect } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { RateLimitSetter } from "@/components/rate-limit-setter";
import CodeBlock from "@/components/ui/code-block";

export const dynamic = "force-dynamic";

export default async function Index({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <Login />;
  }

  const { data: {account_id}, error } = await supabase
    .from('members')
    .select('account_id')
    .eq('user_id', user.id)
    .single();

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
    <div id="train-model-container" className="w-full h-full mt-8">
      <div className="flex flex-row gap-4">
        <Link href="/app" className="text-xs w-fit">
          <Button variant={"outline"} className="text-xs" size="sm">
            <FaArrowLeft className="mr-2" />
            Go Back
          </Button>
        </Link>
        <div className="flex flex-row gap-2 align-middle text-center items-center pb-4">
          <h1 className="text-xl">{project.name}</h1>
          <div className="hidden lg:flex flex-row gap-2">
            <Link href={`/app/projects/${params.id}`}>
              <Button variant={"ghost"}>Dashboard</Button>
            </Link>
            <Link href={`/app/projects/${params.id}/requests`}>
              <Button variant={"ghost"}>Requests</Button>
            </Link>
            <Link href={`/app/projects/${params.id}/settings`}>
              <Button variant={"ghost"}>
                Settings
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full justify-between items-center text-center max-w-lg m-auto mb-4 py-4 rounded-lg">
        <h1 className="text-gray-900 text-xl">Get Started</h1>
      </div>
        <SaveOpenAIKeySection projectId={params.id || null} />
      <div className="flex flex-col gap-4 w-full justify-between items-center text-center max-w-lg m-auto mt-8 mb-8 py-4 bg-gray-100 rounded-lg">
        <h1 className="font-bold">2. Import backless ai</h1>
        <CodeBlock copyText={'npm i backless-ai'}>
          npm i backless-ai
        </CodeBlock>
        <div className="px-8 text-xs">
          <CodeBlock className="text-sm" copyText={`import ${'{'} OpenAIClient ${'}'} from 'backless-ai';\n\nconst openai = OpenAIClient('${project.id}');`}>
            import {'{'} OpenAIClient {'}'} from 'backless-ai';<br /><br />
            const openai = OpenAIClient('{project.id}');
          </CodeBlock>
        </div>
        <div className="text-gray-500 text-sm">
          <p>
            Use this key in your frontend javascript to get started!
          </p>
          <p>
            <Link href="/docs" className="text-blue-500 hover:underline">
              Learn more
            </Link>
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full justify-between items-center text-center max-w-lg m-auto mt-8 mb-8 py-4 bg-gray-100 rounded-lg">
        <h1 className="font-bold">3. Set user controls</h1>
        <h2 className="text-gray-900 pt-2 px-4 rounded-md">
          User Authentication
        </h2>
        <UserAuthPicker projectId={params.id} />
        <h2 className="text-gray-900 pt-2 px-4 rounded-md">
          User Limit
        </h2>
        <RateLimitSetter projectId={params.id} rateLimit={project.user_rate_limit} ratePeriod={project.user_rate_period} type={'project_user'} unit={'cents'} />
        <h2 className="text-gray-900 pt-2 px-4 rounded-md">
          Project Limit
        </h2>
        <RateLimitSetter projectId={params.id} rateLimit={project.rate_limit} ratePeriod={project.rate_period} type={'project'} unit={'cents'} />
      </div>
      <div className="flex flex-col gap-4 w-full justify-between items-center text-center max-w-lg m-auto mt-8 mb-8 py-4 bg-gray-100 rounded-lg">
        <h1 className="font-bold">4. Explore our collection of pre-built AI applications and features perfect for your project</h1>
        <div className="text-gray-500 text-sm">
          <Link href="/components" className="text-blue-500 hover:underline">
            Learn more
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full justify-between items-center text-center max-w-lg m-auto mt-8 mb-8 py-4 bg-gray-100 rounded-lg">
        <h1 className="font-bold">5. Monitor usage and access user data</h1>
        <div className="text-gray-500 text-sm">
          <p>
            View usage and request logs in your dashboard split by project and user.
          </p>
          <p>
            <Link href="/docs" className="text-blue-500 hover:underline">
              Learn more
            </Link>
          </p>
        </div>
      </div>
      {/* <ClientSideModel samples={samples ?? []} serverModel={model} serverImages={images ?? []} /> */}
    </div>
  );
}
