"use client";

import CategoryTable from "./categoryTable";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FiBox, FiGrid } from "react-icons/fi";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function CategoriesPage() {
  return (
 
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FiGrid className="w-6 h-6 text-primary" />
            </div>
           
            <div>
              <h1 className="text-2xl font-bold">Categories</h1>
              <p className="text-muted-foreground">Manage your product categories and subcategories</p>
              
            </div>
          </div>
          <div className="flex items-center gap-4">
            
            <div className="flex items-center gap-2 p-4 bg-card rounded-lg border">
              <FiBox className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Total Categories</p>
                <p className="text-2xl font-bold">24</p>
              </div>
               <Link href={"/dashboard/category/create"} className="cursor-pointer dark:bg-white dark:text-white bg-black text-white px-4 py-2 rounded-md">
              Create category
            </Link>
              <Link href={"/dashboard/subcategory/create"} className="cursor-pointer dark:bg-white dark:text-white bg-black text-white px-4 py-2 rounded-md">
              Create Sub category
            </Link>
            </div>
          </div>
        </div>
        <CategoryTable />
      </div>
  
  );
}