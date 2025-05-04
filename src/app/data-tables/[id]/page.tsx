
"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit } from "lucide-react";

import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { DataItem } from "@/app/data-tables/page"; // Import the type
import { Skeleton } from "@/components/ui/skeleton"; // For loading state

// Mock Data Function (Replace with actual data fetching)
const getUserById = (id: string): DataItem | undefined => {
  // Simulate fetching data
  const data: DataItem[] = [
    { id: "m5gr84i9", name: "John Doe", email: "john.doe@example.com", role: "Admin", status: "Active", createdAt: new Date(2023, 5, 15) },
    { id: "3u1reuv4", name: "Jane Smith", email: "jane.smith@example.com", role: "User", status: "Active", createdAt: new Date(2023, 6, 20) },
    { id: "derv1ws0", name: "Bob Johnson", email: "bob.j@sample.net", role: "Editor", status: "Inactive", createdAt: new Date(2024, 0, 1) },
    { id: "5kma53ae", name: "Alice Brown", email: "alice.b@mail.org", role: "User", status: "Pending", createdAt: new Date(2024, 1, 10) },
    { id: "bhqecj4p", name: "Charlie Davis", email: "charlie.d@test.co", role: "Admin", status: "Active", createdAt: new Date(2024, 2, 5) },
    { id: "p2qwef8k", name: "Diana Evans", email: "diana.e@sample.com", role: "User", status: "Active", createdAt: new Date(2024, 3, 12) },
    { id: "z9xcvbnm", name: "Ethan Garcia", email: "ethan.g@test.net", role: "Editor", status: "Pending", createdAt: new Date(2024, 4, 22) },
  ];
  return data.find(item => item.id === id);
};

export default function ViewUserPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = React.useState<DataItem | null>(null);
  const [loading, setLoading] = React.useState(true);
  const userId = params.id as string; // Type assertion

  React.useEffect(() => {
    if (userId) {
      setLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        const fetchedUser = getUserById(userId);
        if (fetchedUser) {
          setUser(fetchedUser);
        } else {
          // Handle user not found, maybe redirect or show error
          console.error("User not found");
          router.push("/data-tables"); // Redirect if user not found
        }
        setLoading(false);
      }, 500); // 500ms delay
    }
  }, [userId, router]);

  const getStatusBadgeClass = (status: DataItem["status"]) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Inactive": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "Pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  return (
    <AppLayout>
      <Header />
      <div className="p-4 md:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
           <Button variant="outline" onClick={() => router.back()} size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <h1 className="text-3xl font-bold text-primary">User Details</h1>
          {!loading && user && (
             <Link href={`/data-tables/${user.id}/edit`} passHref>
              <Button size="sm">
                <Edit className="mr-2 h-4 w-4" /> Edit User
              </Button>
            </Link>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Detailed view of the selected user.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/5" />
                  <Skeleton className="h-6 w-3/5" />
                </div>
                 <div className="space-y-2">
                   <Skeleton className="h-4 w-1/5" />
                   <Skeleton className="h-5 w-4/5" />
                 </div>
                 <div className="space-y-2">
                   <Skeleton className="h-4 w-1/5" />
                   <Skeleton className="h-5 w-1/4" />
                 </div>
                <div className="space-y-2">
                   <Skeleton className="h-4 w-1/5" />
                   <Skeleton className="h-6 w-1/4 rounded-full" />
                 </div>
                 <div className="space-y-2">
                   <Skeleton className="h-4 w-1/5" />
                   <Skeleton className="h-5 w-2/5" />
                 </div>
              </div>
            ) : user ? (
              <>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="text-lg font-semibold">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-lg">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Role</p>
                  <p className="text-lg capitalize">{user.role}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(user.status)}`}
                  >
                    {user.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created At</p>
                  <p className="text-lg">{new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'short' }).format(user.createdAt)}</p>
                </div>
              </>
            ) : (
              <p className="text-center text-muted-foreground">User not found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

