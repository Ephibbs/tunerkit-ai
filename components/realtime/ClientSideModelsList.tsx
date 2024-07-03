"use client";

import { Button } from "@/components/ui/button";
import { Database } from "@/types/supabase";
import { modelRowWithSamples } from "@/types/utils";
import { createClient } from '@/utils/supabase/client'
import Link from "next/link";
import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitHandler, useForm } from "react-hook-form";
import { settingsFormSchema } from "@/types/zod";
import * as z from "zod";
import SaveOpenAIKeySection from "@/components/SaveOpenAIKey";
import { FaImages } from "react-icons/fa";
import ProjectsList from "../ModelsTable";

export const revalidate = 0;

type ClientSideModelsListProps = {
  serverModels: modelRowWithSamples[] | [];
};

type FormInput = z.infer<typeof settingsFormSchema>;

export default function ClientSideProjectsList({
  serverProjects,
}: any) {
  const supabase = createClient()
  // const [plan, setPlan] = useState<object | null>(null);
  const [projects, setProjects] = useState<any[]>(serverProjects);

  // useEffect(() => {
  //   const fetchPlan = async () => {
  //     const { data, error } = await supabase
  //       .from("accounts")
  //       .select("*")
  //       .single();

  //     if (error) {
  //       console.error(error);
  //     } else {
  //       console.log(data);
  //       setPlan(data);
  //     }
  //   };

  //   fetchPlan();
  // }, []);

  const form = useForm<FormInput>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      userRateLimitWindow: "hour",
      userRateLimit: 30,
      projectSpendLimitWindow: "hour",
      projectSpendLimit: 2.00
    },
  });

  const userRateLimitWindow = form.watch("userRateLimitWindow");
  const projectSpendLimitWindow = form.watch("projectSpendLimitWindow");
  const userSpendLimitWindow = form.watch("userSpendLimitWindow");

  useEffect(() => {
    const channel = supabase
      .channel("realtime-models")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "projects" },
        async (payload: any) => {
          // const samples = await supabase
          //   .from("samples")
          //   .select("*")
          //   .eq("modelId", payload.new.id);

          const newProject: modelRowWithSamples = payload.new;

          const dedupedProjects = projects.filter(
            (project) => project.id !== payload.old?.id
          );

          setProjects([...dedupedProjects, newProject]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, projects, setProjects]);

  return (
    <div id="train-model-container" className="w-full">
      {projects && projects.length > 0 && (
        <div className="flex flex-col gap-4 my-16">
          <div className="flex flex-row gap-4 w-full justify-between items-center text-center">
            <h1>Your projects</h1>
            <Link href="/app/projects/new" className="w-fit">
              <Button size={"sm"}>
                New project
              </Button>
            </Link>
          </div>
          <ProjectsList projects={projects} />
        </div>
      )}
      {projects && projects.length === 0 && (
        <div className="flex flex-col gap-4 items-center my-16">
          <FaImages size={64} className="text-gray-500" />
          <h1 className="text-2xl">
            Start your first project
          </h1>
          <div>
            <Link href="/app/projects/new">
              <Button size={"lg"}>New project</Button>
            </Link>
          </div>
        </div>
      )}
      {/* <div className="flex flex-col gap-4 w-full justify-between items-center text-center max-w-lg m-auto mt-8 mb-8 py-4 bg-gray-100 rounded-lg">
        <h1>Client Key</h1>
        <h2 className="text-gray-900 bg-gray-300 p-2 rounded-md">
          {plan?.client_key}
        </h2>
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
      </div> */}
      {/* <div className="flex flex-col gap-4 w-full justify-between items-center text-center max-w-lg m-auto mt-8 py-4 rounded-lg">
        <h1 className="text-gray-900 text-xl">Users</h1>
      </div>
      <div className="flex flex-col gap-4 w-full justify-between items-center text-center max-w-lg m-auto mb-8 py-4 bg-gray-100 rounded-lg">
        <h1>Supabase Project URL</h1>
        <div className="flex flex-row gap-4 items-center text-center">
          <input className="text-gray-900 bg-gray-300 p-2 rounded-md" />
          <button className="text-white bg-red-500 p-2 rounded-md">Save</button>
        </div>
        <div className="text-gray-500 text-sm px-4">
          <p>
            Input your Supabase project URL here to authenticate users. Alternatively, this can be set directly from the frontend.
          </p>
        </div>
      </div> */}
      {/* <div className="flex flex-col gap-4 w-full justify-between items-center text-center max-w-lg m-auto mb-4 py-4 rounded-lg">
        <h1 className="text-gray-900 text-xl">Settings</h1>
      </div>
      <SaveOpenAIKeySection supabase={supabase} /> */}
      {/* <div className="flex flex-col gap-4 w-full justify-between items-center text-center max-w-lg m-auto mt-8 py-4 bg-gray-100 rounded-lg">
        <h1>User Spend limit</h1>
        <div className="flex flex-row gap-4 items-center text-center">
          <input className="text-gray-900 bg-gray-300 p-2 rounded-md" />
          <button className="text-gray-900 bg-gray-300 p-2 rounded-md">Save</button>
        </div>
        <div className="text-gray-500 text-sm">
          <RadioGroup
            defaultValue={userSpendLimitWindow}
            className="grid grid-cols-5 gap-2"
            value={userSpendLimitWindow}
            onValueChange={(value: any) => {
              form.setValue("userSpendLimitWindow", value);
            }}
          >
            <div>
              <RadioGroupItem
                value="minute"
                id="none"
                className="peer sr-only"
                aria-label="none"
              />
              <Label
                htmlFor="none"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                min
              </Label>
            </div>

            <div>
              <RadioGroupItem
                value="hour"
                id="supabase"
                className="peer sr-only"
                aria-label="supabase"
              />
              <Label
                htmlFor="supabase"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                hour
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="day"
                id="supabase"
                className="peer sr-only"
                aria-label="supabase"
              />
              <Label
                htmlFor="supabase"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                day
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="week"
                id="supabase"
                className="peer sr-only"
                aria-label="supabase"
              />
              <Label
                htmlFor="supabase"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                week
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="month"
                id="supabase"
                className="peer sr-only"
                aria-label="supabase"
              />
              <Label
                htmlFor="supabase"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                month
              </Label>
            </div>
          </RadioGroup>
        </div>
        <div className="text-gray-500 text-sm">
          <p>
            Set the total spend a user can make in a period.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full justify-between items-center text-center max-w-lg m-auto mt-8 py-4 bg-gray-100 rounded-lg">
        <h1>User Rate limit</h1>
        <div className="flex flex-row gap-4 items-center text-center">
          <input className="text-gray-900 bg-gray-300 p-2 rounded-md" />
          <button className="text-gray-900 bg-gray-300 p-2 rounded-md">Save</button>
        </div>
        <div className="text-gray-500 text-sm">
          <RadioGroup
            defaultValue={userRateLimitWindow}
            className="grid grid-cols-5 gap-2"
            value={userRateLimitWindow}
            onValueChange={(value: any) => {
              form.setValue("userRateLimitWindow", value);
            }}
          >
            <div>
              <RadioGroupItem
                value="min"
                id="none"
                className="peer sr-only"
                aria-label="none"
              />
              <Label
                htmlFor="none"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                min
              </Label>
            </div>

            <div>
              <RadioGroupItem
                value="hour"
                id="supabase"
                className="peer sr-only"
                aria-label="supabase"
              />
              <Label
                htmlFor="supabase"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                hour
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="day"
                id="supabase"
                className="peer sr-only"
                aria-label="supabase"
              />
              <Label
                htmlFor="supabase"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                day
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="week"
                id="supabase"
                className="peer sr-only"
                aria-label="supabase"
              />
              <Label
                htmlFor="supabase"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                week
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="month"
                id="supabase"
                className="peer sr-only"
                aria-label="supabase"
              />
              <Label
                htmlFor="supabase"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                month
              </Label>
            </div>
          </RadioGroup>
        </div>
        <div className="text-gray-500 text-sm">
          <p>
            Set the maximum number of requests a user can make in a period.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full justify-between items-center text-center max-w-lg m-auto mt-8 py-4 bg-gray-100 rounded-lg">
        <h1>App Spend Limit</h1>
        <div className="flex flex-row gap-4 items-center text-center">
          <span className="text-gray-900">$</span>
          <input className="text-gray-900 bg-gray-300 p-2 rounded-md" placeholder="Number (e.g. 100)" />
          <button className="text-gray-900 bg-gray-300 p-2 rounded-md">Save</button>
        </div>
        <div className="text-gray-500 text-sm">
          <RadioGroup
            defaultValue={projectSpendLimitWindow}
            className="grid grid-cols-5 gap-2"
            value={projectSpendLimitWindow}
            onValueChange={(value: any) => {
              form.setValue("projectSpendLimitWindow", value);
            }}
          >
            <div>
              <RadioGroupItem
                value="min"
                id="none"
                className="peer sr-only"
                aria-label="none"
              />
              <Label
                htmlFor="none"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                min
              </Label>
            </div>

            <div>
              <RadioGroupItem
                value="hour"
                id="supabase"
                className="peer sr-only"
                aria-label="supabase"
              />
              <Label
                htmlFor="supabase"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                hour
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="day"
                id="supabase"
                className="peer sr-only"
                aria-label="supabase"
              />
              <Label
                htmlFor="supabase"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                day
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="week"
                id="supabase"
                className="peer sr-only"
                aria-label="supabase"
              />
              <Label
                htmlFor="supabase"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                week
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="month"
                id="supabase"
                className="peer sr-only"
                aria-label="supabase"
              />
              <Label
                htmlFor="supabase"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                month
              </Label>
            </div>
          </RadioGroup>
        </div>
        <div className="text-gray-500 text-sm px-4">
          <p>
            Set the maximum amount you are willing to spend in a period. This will help you manage your costs and prevent unexpected charges occurred during unusual usage such as a spike in traffic or DDOS attack.
          </p>
        </div>
      </div> */}
    </div>
  );
}
