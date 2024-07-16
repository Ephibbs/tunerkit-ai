import { Database } from "@/types/supabase";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { streamToString } from "@/lib/utils";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("MISSING NEXT_PUBLIC_SUPABASE_URL!");
}

if (!supabaseServiceRoleKey) {
  throw new Error("MISSING SUPABASE_SERVICE_ROLE_KEY!");
}

export async function POST(request: Request) {
  console.log("Request from: ", request.url);
  console.log("Request: ", request);
  const headersObj = headers();
  const sig = headersObj.get("stripe-signature");

  if (!stripeSecretKey) {
    console.log("Missing stripeSecretKey");
    return NextResponse.json(
      {
        message: `Missing stripeSecretKey`,
      },
      { status: 400 }
    );
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2023-08-16",
    typescript: true,
  });

  if (!sig) {
    console.log("Missing signature");
    return NextResponse.json(
      {
        message: `Missing signature`,
      },
      { status: 400 }
    );
  }

  if (!request.body) {
    console.log("Missing body");
    return NextResponse.json(
      {
        message: `Missing body`,
      },
      { status: 400 }
    );
  }

  const rawBody = await streamToString(request.body);

  let event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret!);
  } catch (err) {
    const error = err as Error;
    console.log("Error verifying webhook signature: " + error.message);
    return NextResponse.json(
      {
        message: `Webhook Error: ${error?.message}`,
      },
      { status: 400 }
    );
  }

  const supabase = createClient<Database>(
    supabaseUrl as string,
    supabaseServiceRoleKey as string,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    }
  );

  let session, subscription, planId, clientReferenceId, subscriptionId;
  console.log("Event type: ", event.type);
  // Handle the event
  switch (event.type) {
    // case 'customer.subscription.deleted':
    //     subscription = event.data.object;
    //     status = subscription.status;
    //     console.log(`Subscription status is ${status}.`);
    //     // Then define and call a method to handle the subscription deleted.
    //     // handleSubscriptionDeleted(subscriptionDeleted);
    //     break;
    //   case 'customer.subscription.created':
    //     subscription = event.data.object;
    //     status = subscription.status;
    //     console.log(`Subscription status is ${status}.`);
    //     // Then define and call a method to handle the subscription created.
    //     // handleSubscriptionCreated(subscription);
    //     break;
    //   case 'customer.subscription.updated':
    //     subscription = event.data.object;
    //     status = subscription.status;
    //     console.log(`Subscription status is ${status}.`);
    //     // Then define and call a method to handle the subscription update.
    //     // handleSubscriptionUpdated(subscription);
    //     break;

    // case "checkout.session.completed":
    //   session = event.data.object as Stripe.Session;

    //   // Retrieve the client_reference_id and subscription_id from the session
    //   clientReferenceId = session.client_reference_id;
    //   subscriptionId = session.subscription;

    //   if (!clientReferenceId) {
    //     return NextResponse.json({ message: `Missing client_reference_id` }, { status: 400 });
    //   }

    //   // Retrieve the subscription details
    //   subscription = await stripe.subscriptions.retrieve(subscriptionId);
    //   planId = subscription.items.data[0].plan.id;

    //   // Update the accounts table in Supabase with the subscription_id and plan
    //   const { data, error } = await supabase
    //     .from('accounts')
    //     .update({ stripe_subscription_id: subscriptionId, plan: planId })
    //     .eq('id', clientReferenceId);

    //   if (error) {
    //     console.log('Error updating Supabase:', error);
    //     return NextResponse.json({ message: `Internal Server Error` }, { status: 500 });
    //   }

    //   console.log('Successfully updated subscription ID and plan in Supabase for client ID:', clientReferenceId);
    //   return NextResponse.json({}, { status: 200 });
    // // case "invoice.paid":
    // //   console.log("invoice.paid received");
    // //   const invoicePaid = event.data.object as Stripe.Invoice;

    // //   console.log("invoicePaid:", invoicePaid);

    // //   // Handle subscription cycle payments (recurring payments)
    // //   if (invoicePaid.billing_reason === "subscription_cycle") {
    // //     return NextResponse.json({}, { status: 200 });
    // //   }

    // //   const customer = await stripe.customers.retrieve(invoicePaid.customer as string);

    // //   console.log("Customer:", customer);

    // //   const subscriptionId = invoicePaid.subscription as string; // Stripe Subscription ID

    // //   // Retrieve the subscription to get plan and metadata
    // //   const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // //   console.log("Subscription:", subscription);

    // //   // Retrieve session
    // //   const session = await stripe.checkout.sessions.retrieve(subscription.metadata.checkout_session_id);

    // //   // Assuming the plan is associated with the subscription's plan ID
    // //   const planId = subscription.items.data[0].plan.id;

    // //   // Retrieve client_reference_id from the metadata of the subscription or customer if necessary
    // //   const clientReferenceId = subscription.metadata.client_reference_id || invoicePaid.metadata.client_reference_id;

    // //   console.log("client_reference_id", clientReferenceId);
    // //   console.log("Subscription ID:", subscriptionId);
    // //   console.log("Plan ID:", planId);
    // //   console.log("metadata:", subscription.metadata);

    // //   if (!clientReferenceId) {
    // //     return NextResponse.json({ message: `Missing client_reference_id` }, { status: 400 });
    // //   }

    // //   // Update the accounts table in Supabase based on the billing reason
    // //   if (invoicePaid.billing_reason === "subscription_create") {
    // //     // console.log("subscription_create received");
    // //     // // Update the subscription_id and plan_id for the initial subscription creation
    // //     // const { data: updateData, error: updateError } = await supabase
    // //     //   .from("accounts")
    // //     //   .update({ stripe_subscription_id: subscriptionId, plan: planId })
    // //     //   .eq("id", clientReferenceId);

    // //     // if (updateError) {
    // //     //   console.log("Error updating Supabase:", updateError);
    // //     //   return NextResponse.json({ message: `Internal Server Error` }, { status: 500 });
    // //     // }

    // //     // console.log("Successfully updated subscription ID and plan in Supabase for client ID:", clientReferenceId);
    // //     return NextResponse.json({}, { status: 200 });
    // //   } else if (invoicePaid.billing_reason === "subscription_update") {
    // //     console.log("subscription_update received");
    // //     // Update the plan_id for subscription updates
    // //     const { data: planUpdateData, error: planUpdateError } = await supabase
    // //       .from("accounts")
    // //       .update({ plan: planId })
    // //       .eq("stripe_subscription_id", subscriptionId);

    // //     if (planUpdateError) {
    // //       console.log("Error updating Supabase:", planUpdateError);
    // //       return NextResponse.json({ message: `Internal Server Error` }, { status: 500 });
    // //     }

    // //     console.log("Successfully updated the plan in Supabase for subscription ID:", subscriptionId);
    // //   }

    // //   return NextResponse.json({}, { status: 200 });
      
    // case "customer.subscription.deleted":
      // const subscriptionDeleted = event.data.object as Stripe.Subscription;

      // console.log("customer.subscription.deleted received");
      // console.log("Subscription Deleted:", subscriptionDeleted);

      // // Retrieve the subscription ID
      // const subscriptionId = subscriptionDeleted.id;

      // // Retrieve the client_reference_id from the subscription metadata
      // const clientReferenceId = subscriptionDeleted.metadata.client_reference_id;

      // console.log("client_reference_id", clientReferenceId);
      // console.log("Subscription ID:", subscriptionId);

      // if (!clientReferenceId) {
      //   return NextResponse.json({ message: `Missing client_reference_id` }, { status: 400 });
      // }

      // // Update the accounts table in Supabase with the subscription_id and plan
      // const { data: deleteData, error: deleteError } = await supabase
      //   .from('accounts')
      //   .update({ stripe_subscription_id: null, plan: null })
      //   .eq('id', clientReferenceId);

      // if (deleteError) {
      //   console.log('Error updating Supabase:', deleteError);
      //   return NextResponse.json({ message: `Internal Server Error` }, { status: 500 });
      // }

      // console.log('Successfully removed subscription ID and plan in Supabase for client ID:', clientReferenceId);
      // return NextResponse.json({}, { status: 200 });
    default:
      return NextResponse.json(
        {
          message: `Unhandled event type ${event.type}`,
        },
        { status: 400 }
      );
  }
}


// const checkoutSessionCompleted = event.data
//         .object as Stripe.Checkout.Session;
//       const userId = checkoutSessionCompleted.client_reference_id;

//       if (!userId) {
//         return NextResponse.json(
//           {
//             message: `Missing client_reference_id`,
//           },
//           { status: 400 }
//         );
//       }

//       const lineItems = await stripe.checkout.sessions.listLineItems(
//         checkoutSessionCompleted.id
//       );
//       const quantity = lineItems.data[0].quantity;
//       const priceId = lineItems.data[0].price!.id;
//       const creditsPerUnit = creditsPerPriceId[priceId];
//       const totalCreditsPurchased = quantity! * creditsPerUnit;

//       console.log({ lineItems });
//       console.log({ quantity });
//       console.log({ priceId });
//       console.log({ creditsPerUnit });

//       console.log("totalCreditsPurchased: " + totalCreditsPurchased);

//       const { data: existingCredits } = await supabase
//         .from("credits")
//         .select("*")
//         .eq("user_id", userId)
//         .single();

//       // If user has existing credits, add to it.
//       if (existingCredits) {
//         const newCredits = existingCredits.credits + totalCreditsPurchased;
//         const { data, error } = await supabase
//           .from("credits")
//           .update({
//             credits: newCredits,
//           })
//           .eq("user_id", userId);

//         if (error) {
//           console.log(error);
//           return NextResponse.json(
//             {
//               message: `Error updating credits: ${JSON.stringify(error)}. data=${data}`,
//             },
//             {
//               status: 400,
//             }
//           );
//         }

//         return NextResponse.json(
//           {
//             message: "success",
//           },
//           { status: 200 }
//         );
//       } else {
//         // Else create new credits row.
//         const { data, error } = await supabase.from("credits").insert({
//           user_id: userId,
//           credits: totalCreditsPurchased,
//         });

//         if (error) {
//           console.log(error);
//           return NextResponse.json(
//             {
//               message: `Error creating credits: ${error}\n ${data}`,
//             },
//             {
//               status: 400,
//             }
//           );
//         }
//       }

//       return NextResponse.json(
//         {
//           message: "success",
//         },
//         { status: 200 }