"use client";

import * as z from "zod";
import { Map } from "@prisma/client";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";

import ImageUpload from "@/components/ui/image-upload";

const formSchema = z.object({
  title: z.string().min(1),
  imageUrl: z.string().min(1),
});

type MapFormValues = z.infer<typeof formSchema>;

interface MapFormProps {
  initialData: Map | null;
}

export const MapForm: React.FC<MapFormProps> = ({
  initialData,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Dynamically render the contents
  const title = initialData
    ? "Edit map"
    : "Create map";
  const toastMessage = initialData ? "Map updated" : "Map created";
  const action = initialData ? "Saves change" : "Create";

  const form = useForm<MapFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (data: MapFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/maps/${params.mapId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/maps`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/maps`);
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.storeId}/maps/${params.mapId}`
      );
      router.refresh();
      router.push(`/${params.storeId}/maps`);
      toast.success("Map deleted.");
    } catch (error: any) {
      toast.error("Something wrong");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description="" />
        {/* Check if only have initial data then it will render the button */}
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Map image</FormLabel>
                <FormControl>
                  <ImageUpload
                    // Even though the map only take 1 image, but Cloudinary expect an array.
                    value={field.value ? [field.value] : []}
                    disable={loading}
                    // If onChange is triggered then we will extract the url from the field
                    onChange={(url) => field.onChange(url)}
                    // If onRemove is triggered then we will return a empty value
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Map Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Map title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-auto gap-8">
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Map URL</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Map URL"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
