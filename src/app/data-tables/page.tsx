
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { ArrowUpDown, ChevronDown, Eye, Edit, Trash2, PlusCircle } from "lucide-react";

import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

// Mock Data - In a real app, this would come from an API or state management
// We need state to handle deletion simulation
const initialData: DataItem[] = [
  { id: "m5gr84i9", name: "John Doe", email: "john.doe@example.com", role: "Admin", status: "Active", createdAt: new Date(2023, 5, 15) },
  { id: "3u1reuv4", name: "Jane Smith", email: "jane.smith@example.com", role: "User", status: "Active", createdAt: new Date(2023, 6, 20) },
  { id: "derv1ws0", name: "Bob Johnson", email: "bob.j@sample.net", role: "Editor", status: "Inactive", createdAt: new Date(2024, 0, 1) },
  { id: "5kma53ae", name: "Alice Brown", email: "alice.b@mail.org", role: "User", status: "Pending", createdAt: new Date(2024, 1, 10) },
  { id: "bhqecj4p", name: "Charlie Davis", email: "charlie.d@test.co", role: "Admin", status: "Active", createdAt: new Date(2024, 2, 5) },
  { id: "p2qwef8k", name: "Diana Evans", email: "diana.e@sample.com", role: "User", status: "Active", createdAt: new Date(2024, 3, 12) },
  { id: "z9xcvbnm", name: "Ethan Garcia", email: "ethan.g@test.net", role: "Editor", status: "Pending", createdAt: new Date(2024, 4, 22) },
];

export type DataItem = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "User" | "Editor";
  status: "Active" | "Inactive" | "Pending";
  createdAt: Date;
};

// Helper function to get data (simulates fetching)
const getData = (): DataItem[] => {
    // In a real app, fetch from API. Here we return a copy of initial data.
    // For state management in this example, we'll manage data within the component.
    return initialData;
};


export default function DataTablesPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [data, setData] = React.useState<DataItem[]>(getData()); // Manage data state
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [itemToDelete, setItemToDelete] = React.useState<DataItem | null>(null);

  const handleDelete = (item: DataItem) => {
    setItemToDelete(item);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      // Simulate deletion by filtering the data state
      setData(currentData => currentData.filter(d => d.id !== itemToDelete.id));
      toast({
        title: "Item Deleted",
        description: `Item "${itemToDelete.name}" has been deleted.`,
        variant: "destructive",
      });
      setItemToDelete(null); // Close the dialog
      // In a real app, you would call an API endpoint here
      console.log("Deleted item:", itemToDelete.id);
    }
  };

 const columns: ColumnDef<DataItem>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => <div className="capitalize">{row.getValue("role")}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.getValue("status") === "Active"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" // Added dark mode styles
              : row.getValue("status") === "Inactive"
              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" // Added dark mode styles
              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" // Added dark mode styles
          }`}
        >
          {row.getValue("status")}
        </span>
      ),
       filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{new Intl.DateTimeFormat('en-US').format(row.getValue("createdAt"))}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original;
        return (
           <div className="flex items-center space-x-1">
              <Link href={`/data-tables/${item.id}`} passHref>
                 <Button variant="ghost" size="icon" aria-label="View item">
                    <Eye className="h-4 w-4" />
                 </Button>
              </Link>
              <Link href={`/data-tables/${item.id}/edit`} passHref>
                 <Button variant="ghost" size="icon" aria-label="Edit item">
                    <Edit className="h-4 w-4" />
                 </Button>
              </Link>
              {/* Use AlertDialogTrigger for Delete */}
              <AlertDialogTrigger asChild>
                 <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" aria-label="Delete item" onClick={() => handleDelete(item)}>
                    <Trash2 className="h-4 w-4" />
                 </Button>
              </AlertDialogTrigger>
           </div>
        );
      },
    },
  ];


  const table = useReactTable({
    data, // Use state variable 'data' here
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
    },
    initialState: {
      pagination: {
        pageSize: 5, // Show 5 rows per page initially
      },
    },
    // Add meta object to pass delete handler to the cell renderer if needed elsewhere
    // meta: {
    //   deleteItem: handleDelete,
    // },
  });

  return (
    <AppLayout>
      <Header /> {/* Add Header */}
      <div className="p-4 md:p-6 lg:p-8"> {/* Add padding */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Data Tables</h1>
          <Link href="/data-tables/add" passHref>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New User
            </Button>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>View, filter, sort, and manage user data.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center py-4 gap-2">
              <Input
                placeholder="Filter by name..."
                value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                  table.getColumn("name")?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-auto">
                      Columns <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {table
                      .getAllColumns()
                      .filter((column) => column.getCanHide())
                      .map((column) => {
                        return (
                          <DropdownMenuCheckboxItem
                            key={column.id}
                            className="capitalize"
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) =>
                              column.toggleVisibility(!!value)
                            }
                          >
                            {column.id}
                          </DropdownMenuCheckboxItem>
                        )
                      })}
                  </DropdownMenuContent>
                </DropdownMenu>
            </div>
             {/* Wrap Table and Actions in AlertDialog */}
            <AlertDialog>
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
                            No results.
                            </TableCell>
                        </TableRow>
                        )}
                    </TableBody>
                    </Table>
                </div>

                 {/* AlertDialog Content for Confirmation */}
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the item
                        "{itemToDelete?.name}".
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
              </div>
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
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

