// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import StripePricingTable from "@/components/stripe/StripeTable";

export const dynamic = "force-dynamic";

export default async function Index() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  return (
    <>
      <h1 className="text-4xl font-bold text-center pb-16 mt-16">Billing</h1>
      <StripePricingTable user={user} />
      {/* <div className="flex flex-col items-center pt-16">
        <h2 className="text-xl font-bold text-center">Credit Balance</h2>
        <h3 className="text-2xl font-semibold">${user.credits || 0}</h3>
      </div>
      <div className="flex flex-col items-center pt-16">
        <h2 className="text-xl font-bold text-center">Auto Refill</h2>
      </div> */}
      <div className="flex items-center pt-16">
        {/* <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add Credits
        </button> */}
        {/* <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4">
          Update Subscription
        </button> */}
      </div>
    </>
  );
}
