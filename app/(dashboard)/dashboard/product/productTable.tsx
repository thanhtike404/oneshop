"use client";
import { Input } from "@/components/ui/input";

import { columns } from "./columns";
import { useProducts } from "@/app/hooks/dashboard/useProducts";
import { useCategories } from "@/app/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { useState } from "react";


import { DataTable } from "@/app/(dashboard)/components/data-table"

export function ProductsTable() {
  const { data: products, isLoading } = useProducts()
  const { data: categories } = useCategories()
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [searchFilter, setSearchFilter] = useState("")

  const filteredData = products?.filter(product => {
    const matchesCategory = categoryFilter === "all" || product.category?.id === categoryFilter
    const matchesSearch = product.name.toLowerCase().includes(searchFilter.toLowerCase())
    return matchesCategory && matchesSearch
  }) ?? []

  return (
    <DataTable
      columns={columns}
      // @ts-ignore
      data={filteredData}
      isLoading={isLoading}
      filters={
        <>
          <Input
            placeholder="Search products..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="max-w-sm"
          />

          <div className="flex items-center space-x-2">
          <Button>
            <Link href='/dashboard/product/create'>Create Product</Link>
          </Button>
          <Select 
            value={categoryFilter} 
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          </div>
        </>
      }
    />
  )
}