"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { Database } from "@/types/supabase";
import { Icons } from "./icons";
import { useRouter } from "next/navigation";
import { modelRowWithSamples } from "@/types/utils";

type ModelsTableProps = {
  models: modelRowWithSamples[];
};

export default function ProjectsList({ projects, path }: { projects: Array<{ id: number; name: string }>, path: string }) {
  const router = useRouter();

  const handleRedirect = (id: number) => {
    router.push(`${path}/${id}`);
  };

  return (
    <div className="rounded-md border p-4 space-y-2">
      {projects?.map((project) => (
        <div key={project.id} className="p-2 hover:bg-gray-200 cursor-pointer rounded-sm" onClick={() => handleRedirect(project.id)}>
          {project.name}
        </div>
      ))}
    </div>
  );
}
