"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import ExpandableColumnList from "@/components/column-list";
import { experimental_useObject as useObject } from 'ai/react';
import { buildZodSchema } from '@/utils/zod-columns';
import { Column } from '@/types/column';
import UserListTable from '@/components/user-list-table';

const createUserListInSupabase = async (supabase: any, name: string, columns: Column[], rows: any) => {
  const { data: session } = await supabase.auth.getSession()
  const userId = session.session?.user?.id;
  if (!userId) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from('user_lists')
    .insert([{ name, columns, user_id: userId, data: rows }])
    .select();

  if (error) throw new Error(error.message);
  return data;
};

const UseDataGenerator = ({ columns, count }) => {
  const callback = useCallback(() => {
    const schema = buildZodSchema(columns);
    return useObject({
      api: '/api/generate-user-list',
      schema: schema,
      fetch: async (url, options) => {
        console.log('fetching', url, options);
        const response = await fetch(url, {
          ...options,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          body: JSON.stringify({
            columns: schema.shape,
            count,
          })
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      }
    });
  }, [columns, count]);

  const { object, submit } = callback();

  return { object, submit };
};

export default function NewProjectZone() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [columns, setColumns] = useState<Column[]>([]);
  const [count, setCount] = useState<number>(10);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  const schema = buildZodSchema(columns);
  const { object, submit } = useObject({
    api: '/api/generate-user-list',
    schema: schema,
  });

  const createProject = useCallback(async () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a user list name.",
      });
      return;
    }

    if (columns.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one column.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = await createUserListInSupabase(supabase, name, columns, object);
      toast({
        title: "Project Created",
        description: "Your user list has been created successfully.",
      });
      router.push(`/app/user-lists/${data[0].id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
    setIsLoading(false);
  }, [name, columns, supabase, toast, router]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="user-list-name">
          Name
        </Label>
        <Input
          id="user-list-name"
          placeholder="e.g. Healthcare Patients, Marketing Leads, etc."
          className="max-w-screen-sm"
          autoComplete="off"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="generate-count">
          Number of Items to Generate
        </Label>
        <Input
          id="generate-count"
          type="number"
          min="1"
          value={count}
          onChange={(e) => setCount(parseInt(e.target.value))}
          className="max-w-screen-sm"
        />
      </div>
      <div className="space-y-2 py-4">
        <Label>
          Columns
        </Label>
        <ExpandableColumnList columns={columns} setColumns={setColumns} />
      </div>
      {/* <Button onClick={createProject} className="w-full" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create User List"}
      </Button> */}
      <Button onClick={() => submit({
        columns,
        count,
      })} className="w-full" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create User List"}
      </Button>
      {object && <>
        <UserListTable object={object} />
        <button onClick={createProject}>Save</button>
      </>}
    </div>
  );
}