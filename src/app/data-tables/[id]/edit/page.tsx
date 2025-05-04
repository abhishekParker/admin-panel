
"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft, Save } from "lucide-react";

import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
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

// Define a Zod schema for the edit user form (similar to add, might have slight variations)
const editUserSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  role: z.enum(["Admin", "User", "Editor"]),
  status: z.enum(["Active", "Inactive", "Pending"]),
  // `createdAt` is usually not editable
});

type EditUserSchema = z.infer<typeof editUserSchema>;

export default function EditUserPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const [loading, setLoading] = React.useState(true);
  const [userNotFound, setUserNotFound] = React.useState(false);

  const form = useForm<EditUserSchema>({
    resolver: zodResolver(editUserSchema),
    // Default values will be set by useEffect after fetching data
    defaultValues: {
      name: "",
      email: "",
      role: "User",
      status: "Pending",
    },
  });

  React.useEffect(() => {
    if (userId) {
      setLoading(true);
      setUserNotFound(false);
      // Simulate API call delay
      setTimeout(() => {
        const fetchedUser = getUserById(userId);
        if (fetchedUser) {
          // Populate form with fetched data
          form.reset({
            name: fetchedUser.name,
            email: fetchedUser.email,
            role: fetchedUser.role,
            status: fetchedUser.status,
          });
        } else {
          console.error("User not found for editing");
          setUserNotFound(true);
          toast({
             title: "Error",
             description: "User not found.",
             variant: "destructive",
           });
        }
        setLoading(false);
      }, 500); // 500ms delay
    }
  }, [userId, form, toast]);

  function onSubmit(values: EditUserSchema) {
    console.log("Edit User Submitted:", values);
    // TODO: Implement logic to update the user (e.g., API call, state update)
    // For now, simulate success and redirect back to the user details page
    toast({
      title: "User Updated!",
      description: `User "${values.name}" has been successfully updated.`,
      variant: "default",
    });
    router.push(`/data-tables/${userId}`); // Redirect back to the view page
  }

  return (
    <AppLayout>
      <Header />
      <div className="p-4 md:p-6 lg:p-8">
         <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={() => router.back()} size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <h1 className="text-3xl font-bold text-primary">Edit User</h1>
          {/* Placeholder for potential actions */}
           <div></div>
        </div>

        {userNotFound ? (
           <Card>
             <CardContent className="p-6 text-center text-muted-foreground">
               User not found or could not be loaded.
             </CardContent>
           </Card>
         ) : (
            <Card>
              <CardHeader>
                <CardTitle>Update User Information</CardTitle>
                <CardDescription>Modify the details for the user.</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-1/2" />
                    <Skeleton className="h-10 w-1/2" />
                    <div className="flex justify-end space-x-2 pt-4">
                       <Skeleton className="h-10 w-20" />
                       <Skeleton className="h-10 w-24" />
                    </div>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                      {/* Name Field */}
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter the user's full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Email Field */}
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="user@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Role Select */}
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Admin">Admin</SelectItem>
                                <SelectItem value="User">User</SelectItem>
                                <SelectItem value="Editor">Editor</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Status Radio Group */}
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Status</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="Active" />
                                  </FormControl>
                                  <FormLabel className="font-normal">Active</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="Inactive" />
                                  </FormControl>
                                  <FormLabel className="font-normal">Inactive</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="Pending" />
                                  </FormControl>
                                  <FormLabel className="font-normal">Pending</FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => router.back()}>
                          Cancel
                        </Button>
                        <Button type="submit">
                          <Save className="mr-2 h-4 w-4" /> Save Changes
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
         )}
      </div>
    </AppLayout>
  );
}
