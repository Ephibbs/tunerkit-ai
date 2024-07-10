'use client';
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { navigate } from '@/app/actions';

export const dynamic = "force-dynamic";

export default async function Index({ params }: { params: { id: string } }) {
  const supabase = createClient();
  
  const deleteProject = async () => {
    await supabase.from("projects").delete().eq("id", params.id);
    navigate("/app");
  }

  return (
    <div className="flex flex-col gap-4 m-auto border rounded-md p-4 max-w-lg">
      <h2 className="text-lg font-bold">Delete Project</h2>
      <p>
        This action cannot be undone. All requests and data associated with this project will be permanently deleted.
      </p>
      <Button onClick={deleteProject} 
        className="bg-red-500 hover:bg-red-600 text-white"
      >
        Delete Project
      </Button>
    </div>
  );
}
