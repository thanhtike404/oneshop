"use client"

import * as React from "react"
import Image from "next/image"
import { Product } from "../dashboard/product/page"
import FsLightbox from "fslightbox-react"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


import { ColumnDef } from "@tanstack/react-table"
import ProductImageCell from "./ProductImageCell"

export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

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
