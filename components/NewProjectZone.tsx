"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaFemale, FaImages, FaMale, FaRainbow } from "react-icons/fa";
import * as z from "zod";
import { createClient } from "@/utils/supabase/client";
import { fileUploadFormSchema } from "@/types/zod";
import { upload } from "@vercel/blob/client";
// import { supabase } from "@/supabase/supabaseClient";

type FormInput = z.infer<typeof fileUploadFormSchema>;

const stripeIsConfigured = process.env.NEXT_PUBLIC_STRIPE_IS_ENABLED === "true";


/**
 * Fetch user data from Supabase using a JWT.
 * 
 * @param {string} token - The JWT token to verify and use for authentication.
 * @param {string} supabaseUrl - Your Supabase project URL.
 * @return {Promise<Object>} - A promise that resolves with the user data if the token is valid.
 */
async function fetchUserData(token: string, supabaseUrl: string) {
  const url = `${supabaseUrl}/auth/v1/user`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'apikey': 'YOUR-SUPABASE-ANON-KEY' // Replace this with your Supabase anon/public key
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}


const getVerifyUrl = (type: string, options: any) => {
  // Implement the logic to get the verify URL based on the type and options just the user endpoint given any necessary parameters in options
  if (type === "supabase") {
    const supabaseUrl = `https://${options.projectId}.supabase.co`

    return `${supabaseUrl}/auth/v1/user`;
  }
  if (type === "firebase") {
    // For Firebase, we use Google's Identity Toolkit API to verify the ID token.
    // Note: This requires setting up an API key that has access to the Identity Toolkit API.
    const firebaseApiKey = options.apiKey; // Your Web API Key
    return `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseApiKey}`;
  }

  throw new Error(`Invalid type: ${type}`);
}

const createProjectInSupabase = async (supabase: any, name: string, app_user_group_id: string | null) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log('user', user);
  const { data: { account_id }, error1 } = await supabase
    .from('members')
    .select('account_id')
    .eq('user_id', user.id)
    .single();

  if (error1) throw new Error(error1 as string);

  console.log('name', name);
  const { data, error } = await supabase
    .from('projects')
    .insert([{ name, user_group_id: null, account_id }])
    .select();

  if (error) throw new Error(error.message);
  return data;
};

export default function NewProjectZone() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<FormInput>({
    resolver: zodResolver(fileUploadFormSchema),
    defaultValues: {
      name: "",
      authentication: "none",
    },
  });

  const authentication = form.watch("authentication");
  const name = form.watch("name");

  const onSubmit: SubmitHandler<FormInput> = () => {
    createProject();
  };

  const createProject = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await createProjectInSupabase(supabase, name, null);
      toast({
        title: "Project Created",
        description: "Your project has been created successfully.",
        // status: "success"
      });
      router.push(`/app/projects/${data[0].id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        // status: "error"
      });
    }
    setIsLoading(false);
  }, [name]);

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="rounded-md flex flex-col gap-8"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full rounded-md">
                <FormLabel>Name</FormLabel>
                <FormDescription>
                  Give your project a name to easily identify it.
                </FormDescription>
                <FormControl>
                  <Input
                    placeholder="e.g. Useful AI"
                    {...field}
                    className="max-w-screen-sm"
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <div className="flex flex-col gap-4">
            <FormLabel>Models</FormLabel>
            <FormDescription>
              Limit which models can be used in this project.
            </FormDescription>
            <RadioGroup
              defaultValue={modelType}
              className="grid grid-cols-3 gap-4"
              value={modelType}
              onValueChange={(value: any) => {
                form.setValue("authentication", value);
              }}
            >
              <div>
                <RadioGroupItem
                  value="none"
                  id="none"
                  className="peer sr-only"
                  aria-label="none"
                />
                <Label
                  htmlFor="none"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  All
                </Label>
              </div>

              <div>
                <RadioGroupItem
                  value="supabase"
                  id="supabase"
                  className="peer sr-only"
                  aria-label="supabase"
                />
                <Label
                  htmlFor="supabase"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  OpenAI
                </Label>
              </div>
            </RadioGroup>
          </div> */}
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Create Project
          </Button>
        </form>
      </Form>
    </div>
  );
}
