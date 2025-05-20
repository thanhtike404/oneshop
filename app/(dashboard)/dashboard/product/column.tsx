"use client"

import * as React from "react"

import { Product } from "@/app/hooks/dashboard/useProducts"



import { ColumnDef } from "@tanstack/react-table"
import ProductImageCell from "../../components/ProductImageCell"


export const columns: ColumnDef<Product>[] = [
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
  }
]
