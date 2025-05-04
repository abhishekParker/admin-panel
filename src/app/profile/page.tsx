
"use client";

import * as React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

// Mock user data (replace with actual data fetching/context)
const mockUser = {
  name: "Admin User",
  email: "admin@example.com",
  avatarUrl: "https://picsum.photos/100/100",
  initials: "AD",
};

export default function ProfilePage() {
  // In a real app, you'd likely use useState and fetch user data
  const [user, setUser] = React.useState(mockUser);
  const [name, setName] = React.useState(user.name);
  const [email, setEmail] = React.useState(user.email);

  const handleSaveChanges = () => {
    // TODO: Implement logic to save profile changes (e.g., API call)
    console.log("Saving profile changes:", { name, email });
    // Update local state (or refetch)
    setUser(prev => ({ ...prev, name, email }));
    // Show a toast notification
  };

  return (
    <AppLayout>
      <Header />
      <div className="p-4 md:p-6 lg:p-8">
        <h1 className="text-3xl font-bold mb-6 text-primary">My Profile</h1>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>View and update your profile details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person avatar large" />
                <AvatarFallback>{user.initials}</AvatarFallback>
              </Avatar>
              <div>
                 {/* File input could be added here for changing avatar */}
                 <Button variant="outline" size="sm">Change Avatar</Button>
                 <p className="text-xs text-muted-foreground mt-1">JPG, GIF or PNG. 1MB max.</p>
              </div>
            </div>

             <div className="space-y-2">
              <Label htmlFor="profile-name">Full Name</Label>
              <Input
                id="profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-email">Email Address</Label>
              <Input
                id="profile-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>

            {/* Placeholder for other profile fields like bio, etc. */}

             <div className="flex justify-end pt-4">
                <Button onClick={handleSaveChanges}>
                 <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
            </div>

          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
