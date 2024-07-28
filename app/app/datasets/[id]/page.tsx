import { createClient } from "@/utils/supabase/server";
import { DatasetDashboardClient } from "@/components/dataset-dashboard";

export default async function DatasetDashboard({ params }: { params: { id: string } }) {
  const supabase = createClient();

  // Fetch dataset
  const { data: dataset } = await supabase
    .from('datasets')
    .select('*')
    .eq('id', params.id)
    .single();

  // Fetch initial datarows
  const { data: initialDatarows } = await supabase
    .from('datarows')
    .select('*')
    .eq('dataset_id', params.id);

    console.log(dataset, initialDatarows);

  if (!dataset || !initialDatarows) {
    return <div>Error loading data</div>;
  }

  return (
    <DatasetDashboardClient
      dataset={dataset}
      initialDatarows={initialDatarows}
      datasetId={params.id}
    />
  );
}