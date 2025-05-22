"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Image as FiImage } from "lucide-react";
import { useState } from "react";
import FsLightbox from "fslightbox-react";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  products: any[]; // Add this line
  subcategories: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    iconUrl: string | null;
  }[];
  createdAt: Date;
  updatedAt: Date;
};

// Create a reusable image cell component
const ImageCell = ({ imageUrl, name }: { imageUrl: string | null; name: string }) => {
  const [lightboxController, setLightboxController] = useState({
    toggler: false,
    sourceIndex: 0
  });

  if (!imageUrl) {
    return (
      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
        <FiImage className="w-5 h-5 text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <div 
        className="relative w-10 h-10 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => setLightboxController({
          toggler: !lightboxController.toggler,
          sourceIndex: 0
        })}
      >
        <img
          src={imageUrl}
          alt={name}
          className="rounded-lg object-cover w-full h-full"
        />
      </div>
      <FsLightbox
        toggler={lightboxController.toggler}
        sources={[imageUrl]}
        sourceIndex={lightboxController.sourceIndex}
      />
    </>
  );
};

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "imageUrl",
    header: "Image",
    cell: ({ row }) => {
      const imageUrl = row.getValue("imageUrl") as string;
      const name = row.getValue("name") as string;
      return <ImageCell imageUrl={imageUrl} name={name} />;
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "subcategories",
    header: "Subcategories",
    cell: ({ row }) => {
      const subcategories = row.getValue("subcategories") as Category["subcategories"];
      return <div>{subcategories.map(sub => sub.name).join(", ")}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return new Date(row.getValue("createdAt")).toLocaleDateString();
    },
  },
  {
    accessorKey: "products",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Products
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const products = row.original.products;
      return (
        <div className="flex items-center gap-2">
          <span className="font-medium">{products.length}</span>
          <span className="text-muted-foreground text-sm">items</span>
        </div>
      );
    },
  },
];