"use client";

import { Button } from "@/components/ui/button";
import { Database } from "@/types/supabase";
import { modelRowWithSamples } from "@/types/utils";
import { createClient } from '@/utils/supabase/client'
import Link from "next/link";
import Image from 'next/image';
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
import Logo from '@/public/badge-svgrepo-com.svg';
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
        <div className="flex flex-col gap-4 my-16 max-w-lg m-auto">
          <div className="flex flex-row gap-4 w-full justify-between items-center text-center">
            <h1
              className="text-2xl text-bold"
            >Your projects</h1>
            <Link href="/app/projects/new" className="w-fit">
              <Button size={"sm"}>
                New project
              </Button>
            </Link>
          </div>
          <ProjectsList projects={projects} path={'/app/projects'}/>
        </div>
      )}
      {projects && projects.length === 0 && (
        <div className="flex flex-col gap-8 items-center my-16">
          <Image src={Logo} alt="Tunerkit" width={120} height={120} />
          <h1 className="text-2xl font-bold">
            Start your first project
          </h1>
          <div>
            <Link href="/app/projects/new">
              <Button size={"lg"}>New project</Button>
            </Link>
          </div>
        </div>
      )}
      {/* <SaveOpenAIKeySection /> */}
      {/* <SpeechGenerator /> */}
    </div>
  );
}
