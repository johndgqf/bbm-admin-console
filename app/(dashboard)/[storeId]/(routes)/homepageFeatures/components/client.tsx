"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { HomepageFeatureColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

interface HomepageFeatureClientProps {
  data: HomepageFeatureColumn[]
}

export const HomepageFeatureClient: React.FC<HomepageFeatureClientProps> = ({
  data
}) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Features (${data.length})`}
          description="Manage homepage features for your website"
        />
        <Button onClick={() => router.push(`/${params.storeId}/homepageFeatures/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="title" columns={columns} data={data} />
    </>
  );
};
