"use client";

import { Input } from "@/components/ui/input";
import { getProductColumns } from "./columns";
import { useDeleteProduct, useProducts, useDeleteManyProducts } from "@/app/hooks/dashboard/useProducts";
import { useCategories } from "@/app/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { useState, useCallback } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/app/(dashboard)/components/data-table";

export function ProductsTable() {
  const queryClient = useQueryClient();
  const { data: products, isLoading } = useProducts();
  const { mutateAsync } = useDeleteManyProducts();
  const { data: categories } = useCategories();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchFilter, setSearchFilter] = useState("");
  const [pendingUpdates, setPendingUpdates] = useState<Set<string>>(new Set());

  const updateFeaturedStatus = async (productId: string, isFeatured: boolean) => {
    const id = String(productId);
    const url = `/api/v1/dashboard/products/${id}/featured`;
    const res = await axios.patch(url, { isFeatured });
    return res.data;
  };

  const { mutate: updateFeaturedProductMutation, isPending } = useMutation({
    mutationFn: ({ productId, isFeatured }: { productId: string; isFeatured: boolean }) => {
      return updateFeaturedStatus(productId, isFeatured);
    },
    onMutate: ({ productId }) => {
      // Add to pending updates to prevent duplicates
      setPendingUpdates(prev => new Set(prev).add(productId));
    },
    onSuccess: (data, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      // Remove from pending updates
      setPendingUpdates(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    },
    onError: (error, { productId }) => {
      console.error("Failed to update featured status:", error);
      // Remove from pending updates even on error
      setPendingUpdates(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  });

  // Memoized callback to prevent unnecessary re-renders
  const handleUpdateFeaturedStatus = useCallback((productId: string, isFeatured: boolean) => {
    const id = String(productId);
    
    // Prevent duplicate requests
    if (pendingUpdates.has(id)) {
      console.log('Update already pending for product:', id);
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
      updateFeaturedProductMutation(
        { productId: id, isFeatured },
        {
          onSuccess: () => resolve(),
          onError: (error) => reject(error)
        }
      );
    });
  }, [updateFeaturedProductMutation, pendingUpdates]);

  const filteredData = products?.filter(product => {
    const matchesCategory = categoryFilter === "all" || product.category?.id === categoryFilter;
    const matchesSearch = product.name.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCategory && matchesSearch;
  }) ?? [];

  return (
    <DataTable
      columns={getProductColumns({ 
        updateFeaturedStatus: handleUpdateFeaturedStatus,
        pendingUpdates 
      })}
      // @ts-ignore
      data={filteredData}
      isLoading={isLoading}
      deleteSelectedIds={mutateAsync}
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
  );
}