"use client";


import { getSlidersColumns } from "./columns";

import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DataTable } from "@/app/(dashboard)/components/data-table";
import Link from "next/link";
export function SliderTable() {
    const {data: sliders,isLoading} =useQuery({
            queryKey: ['sliders'],
            queryFn: () => axios.get('/api/v1/dashboard/settings/sliders').then(res => res.data)
    })

  return (
     <div className="flex flex-col space-y-12">
     <Link
  href="/dashboard/settings/sliders/create"
  className="self-end w-40 cursor-pointer dark:bg-white dark:text-black bg-black text-white px-4 py-2 rounded-md"
>
  Create Slider
</Link>


      <DataTable
        columns={getSlidersColumns({ isLoading })}
        // @ts-ignore
        data={sliders ?? []}
      />
    </div>

  );
}