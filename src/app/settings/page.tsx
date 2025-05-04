
"use client";

import * as React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes"; // Import useTheme
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  // Placeholder states for settings
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [pushNotifications, setPushNotifications] = React.useState(false);
  // Add more setting states as needed

  return (
    <AppLayout>
      <Header />
      <div className="p-4 md:p-6 lg:p-8">
        <h1 className="text-3xl font-bold mb-6 text-primary">Settings</h1>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">

          {/* Appearance Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel of the application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <RadioGroup
                    value={theme}
                    onValueChange={setTheme}
                    className="flex space-x-4"
                  >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                     <RadioGroupItem value="light" id="theme-light" />
                    <Label htmlFor="theme-light" className="font-normal">Light</Label>
                   </FormItem>
                   <FormItem className="flex items-center space-x-2 space-y-0">
                     <RadioGroupItem value="dark" id="theme-dark" />
                     <Label htmlFor="theme-dark" className="font-normal">Dark</Label>
                   </FormItem>
                   <FormItem className="flex items-center space-x-2 space-y-0">
                     <RadioGroupItem value="system" id="theme-system" />
                     <Label htmlFor="theme-system" className="font-normal">System</Label>
                   </FormItem>
                  </RadioGroup>
              </div>
              {/* Add more appearance settings like font size, density etc. */}
            </CardContent>
          </Card>

          {/* Account Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Manage your account details and security.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" placeholder="Enter current password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" placeholder="Enter new password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" placeholder="Confirm new password" />
              </div>
              <div className="flex justify-end">
                <Button>Update Password</Button>
              </div>
              <Separator />
              <Button variant="destructive">Delete Account</Button>
              <p className="text-xs text-muted-foreground">Permanently delete your account and all associated data.</p>
            </CardContent>
          </Card>

          {/* Notification Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Configure how you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                  <span>Email Notifications</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Receive updates and alerts via email.
                  </span>
                </Label>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
                  <span>Push Notifications</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Get real-time alerts on your device (if supported).
                  </span>
                </Label>
                <Switch
                  id="push-notifications"
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>
              {/* Add more notification preferences */}
            </CardContent>
          </Card>

           {/* Add more setting categories as Cards here (e.g., Integrations, Billing) */}

        </div>
      </div>
    </AppLayout>
  );
}

// Minimal FormItem component needed for RadioGroup Label association
const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("space-y-2", className)} {...props} />
  )
})
FormItem.displayName = "FormItem"
