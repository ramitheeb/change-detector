"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MonitorEvent } from "@/lib/db/schema";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export function DataTableDemo({
  data,
  emptyMessage = "No Events, your monitor has not run yet.",
}: {
  data: Omit<MonitorEvent, "monitorId">[];
  emptyMessage?: string;
}) {
  const columns: ColumnDef<Omit<MonitorEvent, "monitorId">>[] = [
    {
      accessorKey: "created_at",
      header: "Time",
      cell: ({ row }) => (
        <div className="lowercase">
          {(row.getValue("created_at") as Date).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "event",
      header: "Event",
      cell: ({ row }) => <div>{row.getValue("event")}</div>,
    },
    {
      accessorKey: "data_changed",
      header: "Data Changed",
      cell: ({ row }) => (
        <div>{row.getValue("data_changed") ? "Yes" : "No"}</div>
      ),
    },
    {
      accessorKey: "data",
      header: "Data",
      cell: ({ row }) => (
        <HoverCard>
          <HoverCardTrigger>
            <p className="w-[200px] overflow-hidden text-ellipsis whitespace-nowrap bg-neutral-800 px-2 p-[1px] rounded-sm">
              {JSON.stringify(row.getValue("data"))}
            </p>
          </HoverCardTrigger>
          <HoverCardContent className="w-fit">
            <pre>{JSON.stringify(row.getValue("data"), null, 2)}</pre>
          </HoverCardContent>
        </HoverCard>
      ),
    },

    {
      accessorKey: "previous_data",
      header: "Previous Data",
      cell: ({ row }) => (
        <HoverCard>
          <HoverCardTrigger>
            <p className="w-[200px] overflow-hidden text-ellipsis whitespace-nowrap bg-neutral-800 px-2 p-[1px] rounded-sm">
              {JSON.stringify(row.getValue("previous_data")).replaceAll(
                "\n",
                ""
              )}
            </p>
          </HoverCardTrigger>
          <HoverCardContent className="w-fit">
            <pre>{JSON.stringify(row.getValue("previous_data"), null, 2)}</pre>
          </HoverCardContent>
        </HoverCard>
      ),
    },
  ];

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageSize: 20,
        pageIndex: 0,
      },
    },
  });

  return (
    <div className="w-full pb-10">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
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
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
