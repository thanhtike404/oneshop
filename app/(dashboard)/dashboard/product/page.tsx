"use client"

import * as React from "react"
import { DataTable } from "@/app/(dashboard)/components/data-table"
import { columns } from "@/app/(dashboard)/components/column"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export type Product = {
  id: string
  name: string
  images: {
    url: string
    altText: string
    isPrimary: boolean
  }[]
  totalStock: number
  stockCount: number
  stocks: {
    quantity: number
    sku: string
    barcode: string
    location: string
    variant: {
      name: string
    }
  }[]
}


const fetchProducts=async()=>{
  const products=await axios.get('/api/v1/dashboard/products')
  return products.data
}



export default function Page() {
  const {data:products}=useQuery({
    queryKey:['products'],
    queryFn:fetchProducts
  })

  console.log(products)
return <DataTable columns={columns} data={products ?? []} />

}
