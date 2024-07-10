import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


function RequestsTable({requests}: {requests: any[]}) {
  return (
    <Table className="w-full overflow-hidden">
      {/* <TableCaption>A list of your recent requests.</TableCaption> */}
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Datetime</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Request</TableHead>
          <TableHead className="text-right">Response</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="overflow-hidden">
        {requests.map((req) => (
          <TableRow key={req.created_at} className="cursor-pointer hover:bg-gray-100 w-full overflow-hidden">
            <TableCell className="font-medium">{req.created_at}</TableCell>
            <TableCell>{req.project_user_id}</TableCell>
            <TableCell>{req.response_code}</TableCell>
            <TableCell>{JSON.stringify(req.request_body)}</TableCell>
            <TableCell >{JSON.stringify(req.response_body)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter> */}
    </Table>
  )
}


export const dynamic = "force-dynamic";

export default async function Index({ params }: { params: { id: string } }) {
  const supabase = createClient();
  
  const {data: requests} = await supabase.from("requests").select("*").eq("project_id", params.id).limit(10);

  // request count
  const { data, count } = await supabase
    .from("requests")
    .select("*", { count: 'exact' })
    .eq("project_id", params.id);

  const { data: user_count, error } = await supabase
    .rpc('count_distinct_users', { input_project_id: params.id });

  if (error) {
    console.error(error);
  }

  return (
    <div className="flex flex-col gap-4 m-auto border rounded-md p-4 max-w-6xl w-full overflow-hidden">
      <h2 className="text-lg font-bold">
        Requests
      </h2>
      {/* requestCount */}
      <div className="flex flex-row gap-4">
        <div className="border rounded-md p-4 flex flex-col gap-4 w-36">
          <h3 className="text-sm text-gray-500">Total Requests:</h3>
          <p className="text-bold text-black text-center text-3xl">{count}</p>
        </div>
        <div className="border rounded-md p-4 flex flex-col gap-4 w-36">
          <h3 className="text-sm text-gray-500">Users: </h3>
          <p className="text-bold text-black text-center text-3xl">{user_count}</p>
        </div>
      </div>
      <RequestsTable requests={requests || []} />
    </div>
  );
}
