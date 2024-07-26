import { createClient } from '@/utils/supabase/server'
import Link from "next/link";
import { redirect } from "next/navigation";

import hero from "/public/hero.png";

import { Button } from "@/components/ui/button";
import ExplainerSection from "@/components/ExplainerSection";
import PricingSection from "@/components/PricingSection";
import SecuritySection from "@/components/SecuritySection";
import {ComponentPreview} from "@/components/component-preview";
import ComponentWrapper from "@/components/component-wrapper";
import AnimatedGradientText from "@/components/magicui/animated-gradient-text";
import { cn } from "@/lib/utils";

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
    <div className="flex flex-col items-center pt-24 w-full bg-neutral-50">
      <div className="w-full max-w-6xl">
        <div className="flex flex-col space-y-4 gap-2 w-full max-w-3xl my-16 mx-auto">
          <AnimatedGradientText>
            <span
              className={cn(
                `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
              )}
            >
              Backless AI + UI
            </span>
          </AnimatedGradientText>
          <h1 className="text-4xl md:text-4xl lg:text-5xl font-extrabold text-center">
            Add AI to your web & mobile apps in minutes
          </h1>
          <p className="text-gray-600 text-lg text-center">
            Focus on the UX. We'll handle the user management, storage, rate-limiting, analytics, and everything else.
          </p>
          <Link href="/login" className="w-fit m-auto">
            <Button className="w-full lg:w-fit text-lg py-6 px-6 my-3 bg-red-500 hover:bg-red-600 font-bold">Start now</Button>
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
  
      <div className="w-full max-w-6xl rounded-tl-[5rem] bg-gradient-to-tl from-transparent via-transparent via-60% to-neutral-200">
        {/* <div className="flex flex-col items-center gap-8 p-8 max-w-7xl ">
          <h2 className="text-5xl font-extrabold text-center bg-gray-100 rounded-md p-4 shadow-md">Backless AI</h2>
          <h2 className="text-4xl font-extrabold text-center">=</h2>
          <h2 className="text-3xl font-extrabold text-center bg-gray-100 rounded-md p-2 shadow-md">A UI library built for cutting-edge AI</h2>
          <h2 className="text-4xl font-extrabold text-center">+</h2>
          <h2 className="text-3xl font-extrabold text-center bg-gray-100 rounded-md p-2 shadow-md">A fast, scalable AI backend with everything you need</h2>
        </div> */}
        <div className="flex flex-col items-center gap-8 p-8 max-w-3xl m-auto">
          <h2 className="text-4xl font-extrabold text-center mt-10">Features</h2>
          <p className="text-lg text-center text-gray-600">
            We provide everything you need to build AI-powered applications and features. From a UI component library for AI to a fast, scalable backend with user management, storage, rate-limiting, analytics, and more.
          </p>
        </div>
        <div className="flex flex-col items-center gap-8 p-8 max-w-3xl m-auto">
          <h2 className="text-4xl font-extrabold text-center">Examples</h2>
          <ComponentPreview name="chat-example" />
          <ComponentPreview name="tts-example" />
          <ComponentPreview name="pii-detector-example" />
          <div className="flex flex-col items-center gap-8 p-4 max-w-7xl w-full">
            <Link href="/docs/components/chat" className="w-fit m-auto">
              <Button className="w-full lg:w-fit text-lg py-5 px-5 my-3 bg-gray-800 hover:bg-gray-900">See all</Button>
            </Link>
          </div>
        </div>
      </div>
      <PricingSection />
      {/* <div className="flex flex-col items-center pt-16">
        * Accounts receive $0.20 in credits free. When using chatgpt 3.5, this equates to about 250 messages.
      </div> */}
    </div>
  );
}
