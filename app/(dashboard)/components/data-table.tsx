"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  getPaginationRowModel,
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
} from "@tanstack/react-table";
import { useState, useEffect } from "react";
import { Product } from "@/prisma/generated"; // Ensure this import is correct

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  filters?: React.ReactNode;
}

export function DataTable<TData extends { id: string | number }, TValue>({ // <--- TData must extend an object with an 'id'
  columns,
  data,
  isLoading = false,
  filters,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      globalFilter,
      pagination,
      rowSelection,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
    // IMPORTANT: Tell Tanstack Table how to get a stable unique ID for each row
    // This is crucial for consistent selection across pagination/sorting
    getRowId: (row) => String(row.id), // Assuming your Product type has a unique 'id' field
  });

  // Function to handle multiple deletion
  const handleDeleteSelected = () => {
    // Get the array of selected row objects
    const selectedRows = table.getSelectedRowModel().rows;

    // Map over the selected row objects to get their original Product.id
    const selectedProductIds = selectedRows.map((row) => row.original.id);

    console.log("Product IDs to delete:", selectedProductIds);

    // --- Here's where you would make your API call to delete products ---
    // Example:
    // try {
    //   const response = await fetch('/api/products/delete-multiple', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ ids: selectedProductIds }),
    //   });
    //   if (response.ok) {
    //     console.log('Selected products deleted successfully!');
    //     // Optionally clear selection after deletion
    //     table.toggleAllRowsSelected(false);
    //     // You might also need to re-fetch your data here
    //   } else {
    //     console.error('Failed to delete products:', response.statusText);
    //   }
    // } catch (error) {
    //   console.error('Error deleting products:', error);
    // }
    // -------------------------------------------------------------------
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      {filters && (
        <div className="flex items-center justify-between gap-4">
          {filters}
          {/* Display Delete Selected Button only when items are selected */}
          {Object.keys(rowSelection).length > 0 && (
            <Button
              variant="destructive" // Use a destructive variant for delete
              onClick={handleDeleteSelected}
              // Disable if no items are selected
              disabled={Object.keys(rowSelection).length === 0}
            >
              Delete Selected ({Object.keys(rowSelection).length})
            </Button>
          )}
        </div>
      )}

      {/* Table Content (loading or data) */}
      <div className="rounded-md border">
        {isLoading ? (
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((_, index) => (
                  <TableHead key={index}>
                    <Skeleton className="h-4 w-24" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(8)].map((_, rowIdx) => (
                <TableRow key={rowIdx}>
                  {columns.map((_, colIdx) => (
                    <TableCell key={colIdx}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {/* Display selected row count */}
          {Object.keys(rowSelection).length > 0 && (
            <div className="text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
          )}
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </Button>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="h-9 border rounded-md px-3 py-2 text-sm bg-background"
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}