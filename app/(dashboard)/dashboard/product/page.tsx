"use client"

import * as React from "react"
import { DataTable } from "@/app/(dashboard)/components/data-table"
import { columns } from "@/app/(dashboard)/dashboard/product/column"

import { useProducts } from "@/app/hooks/dashboard/useProducts"





export default function Page() {
  const {data:products,isLoading}=useProducts()
return <DataTable columns={columns} data={products ?? []} isLoading={isLoading} />

}
