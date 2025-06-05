"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import { Sliders } from "@/prisma/generated";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export const getSlidersColumns = ({
  isLoading,
  onStatusChange, // Add this callback prop
}: {
  isLoading?: boolean;
  onStatusChange?: (id: string, isActive: boolean) => Promise<void> | void;
}): ColumnDef<Sliders>[] => [
  {
    id: "select",
    header: ({ table }) => (
      isLoading ? (
        <Skeleton className="h-4 w-4" />
      ) : (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      )
    ),
    cell: ({ row }) => (
      isLoading ? (
        <Skeleton className="h-4 w-4" />
      ) : (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      )
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "image",
    header: "Image",
    cell: ({ row }) => {
      if (isLoading) {
        return <Skeleton className="h-10 w-10 rounded" />;
      }
      
      const imageUrl = row.original.image;
      const title = row.original.title;
      
      return (
        <div className="h-10 w-10 rounded overflow-hidden">
          {isLoading && (
            <div className="h-full w-full flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          )}
          <Image 
            alt={title || "Slider image"} 
            src={imageUrl}  
            width={40} 
            height={40}
            className="object-cover w-full h-full"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Image Title",
    cell: ({ row }) => (
      isLoading ? (
        <Skeleton className="h-4 w-[100px]" />
      ) : (
        row.getValue("title")
      )
    ),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const slider = row.original;
      
      if (isLoading) {
        return <Skeleton className="h-4 w-[50px]" />;
      }
      
      return (
        <Checkbox
          checked={slider.isActive}
          onCheckedChange={async (checked) => {
            const newStatus = !!checked;
            if (onStatusChange) {
              await onStatusChange(slider.id, newStatus);
            }
          }}
          aria-label="Toggle active status"
        />
      );
    },
  },
  {
    accessorKey: "id",
    header: "Action",
    cell: ({ row }) => {
      const slider = row.original;
      return (
        <div className="flex items-center gap-2">
          {isLoading ? (
            <Skeleton className="h-8 w-8 rounded" />
          ) : (
            <Link href={`/dashboard/settings/${slider.id}`}>
              <Button variant="ghost" size="icon">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      );
    },
  },
];