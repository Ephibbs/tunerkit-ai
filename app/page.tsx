import { createClient } from '@/utils/supabase/server'
import Link from "next/link";
import { redirect } from "next/navigation";

import hero from "/public/hero.png";

import { Button } from "@/components/ui/button";
import ExplainerSection from "@/components/ExplainerSection";
import PricingSection from "@/components/PricingSection";
import SecuritySection from "@/components/SecuritySection";

export const dynamic = "force-dynamic";

function isSubscribed(user: any, supabase: any) {

  const { data: plan } = supabase
    .from("accounts")
    .select("plan")
    .eq("user_id", user.id)
    .single();

  if (plan === "basic") {
    return true;
  }
  return false;
}

export default async function Index() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log(user);
  if (user && isSubscribed(user, supabase)) {
    return redirect("/app");
  }

  return (
    <div className="flex flex-col items-center pt-24">
      <div className="flex flex-col items-center gap-8 p-8 max-w-7xl w-full">
        <div className="flex flex-col space-y-4 gap-2 w-full">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-center">
            UI components for your AI projects
          </h1>
          <p className="text-gray-600 text-lg text-center">
            Focus on the UI. We'll handle the user management, rate-limiting, analytics, and everything else.
          </p>
          <Link href="/login" className="w-fit m-auto">
            <Button className="w-full lg:w-fit text-lg py-5 px-5 my-3 bg-red-500 hover:bg-red-600">Start now</Button>
          </Link>
        </div>
        {/* <div className="lg:w-1/2 w-full mt-8 lg:mt-0">
          <div className="relative w-full h-full">
            <p className="text-gray-500 text-sm">
              5-6 top models along the top animated feeding into a browser icon and a phone icon below
            </p>
          </div>
        </div> */}
      </div>
      {/* <ExplainerSection /> */}
      {/* <SecuritySection /> */}
      {/* <ComponentSection /> */}
      <PricingSection />
      {/* <div className="flex flex-col items-center pt-16">
        * Accounts receive $0.20 in credits free. When using chatgpt 3.5, this equates to about 250 messages.
      </div> */}
    </div>
  );
}
