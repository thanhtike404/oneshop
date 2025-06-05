"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import { Product } from "@/prisma/generated";
import ProductImageCell from "../../components/ProductImageCell";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductColumnsProps {
  updateFeaturedStatus: (productId: string, isFeatured: boolean) => Promise<void>;
  pendingUpdates: Set<string>;
}

export const getProductColumns = ({
  updateFeaturedStatus,
  pendingUpdates,
}: ProductColumnsProps): ColumnDef<Product>[] => [
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
    header: "Featured Product",
    cell: ({ row }) => {
      const product = row.original;
      const productId = String(product.id);
      const isPending = pendingUpdates.has(productId);
      
      return (
        <div className="flex items-center gap-2">
          {isPending && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
          <Select
            value={product.isFeatured ? "true" : "false"} // Use value instead of defaultValue
            onValueChange={(value) => {
              if (isPending) {
                console.log('Update already in progress for product:', productId);
                return;
              }
              
              const isFeatured = value === "true";
              console.log('Updating featured status:', { productId, isFeatured });
              updateFeaturedStatus(productId, isFeatured).catch(console.error);
            }}
            disabled={isPending} // Disable while updating
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select Featured" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Featured</SelectItem>
              <SelectItem value="false">Not Featured</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    }
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