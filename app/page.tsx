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
    return redirect("/overview");
  }

  return (
    <div className="flex flex-col items-center pt-16">
      <div className="flex flex-col lg:flex-row items-center gap-8 p-8 max-w-6xl w-full">
        <div className="flex flex-col space-y-4 lg:w-1/2 w-full">
          <h1 className="text-6xl font-bold">
            Access AI models directly from your frontend
          </h1>
          {/* <p className="text-gray-600 text-lg">
            User management, rate-limiting, logging, and scaling are all handled for you.
          </p> */}
          <div className="grid grid-cols-2 gap-4">
            <p className="text-gray-600 text-lg">
              Built-in rate limiting
            </p>
            <p className="text-gray-600 text-lg">
              Secure user management
            </p>
            <p className="text-gray-600 text-lg">
              Detailed logging
            </p>
            <p className="text-gray-600 text-lg">
              Auto-scaling
            </p>
          </div>
          <div className="flex flex-col space-y-2">
            <Link href="/login" className="w-fit">
              <Button className="w-full lg:w-fit text-lg py-5 px-5 my-3">Start now</Button>
            </Link>
            {/* <p className="text-sm text-gray-500 italic">
              Start with 250 messages free!*
            </p> */}
          </div>
          <div className="mt-4 text-gray-500">
            <span>Already a member? </span>
            <Link className="text-blue-600 hover:underline" href="/login">
              Sign In
            </Link>
          </div>
        </div>
        <div className="lg:w-1/2 w-full mt-8 lg:mt-0">
          <div className="relative w-full h-full">
            <p className="text-gray-500 text-sm">
              5-6 top models along the top animated feeding into a browser icon and a phone icon below
            </p>
          </div>
        </div>
      </div>
      <ExplainerSection />
      <SecuritySection />
      <PricingSection />
      {/* <div className="flex flex-col items-center pt-16">
        * Accounts receive $0.20 in credits free. When using chatgpt 3.5, this equates to about 250 messages.
      </div> */}
    </div>
  );
}
