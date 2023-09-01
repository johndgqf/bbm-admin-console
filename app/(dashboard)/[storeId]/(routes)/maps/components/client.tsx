"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { MapColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

interface MapClientProps {
  data: MapColumn[]
}

export const MapClient: React.FC<MapClientProps> = ({
  data
}) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Maps (${data.length})`}
          description="Manage maps for your website"
        />
        <Button onClick={() => router.push(`/${params.storeId}/maps/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="title" columns={columns} data={data} />
    </>
  );
};
