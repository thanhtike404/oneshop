"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Eye } from "lucide-react";
import Link from "next/link";
import { Product } from "@/prisma/generated";
import ProductImageCell from "../../components/ProductImageCell";
import { Checkbox } from "@/components/ui/checkbox";
export const columns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "image",
    header: "Image",
    // @ts-ignore
    cell: ({ row }) => <ProductImageCell product={row.original} />,
  },
  {
    accessorKey: "name",
    header: "Product Name"
  },
  {
    accessorKey: "totalStock",
    header: "Total Stock"
  },
  {
    accessorKey: "stockCount",
    header: "Variants"
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;
      
      return (
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/product/${product.id}`}>
            <Button variant="ghost" size="icon">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      );
    },
  },
];
