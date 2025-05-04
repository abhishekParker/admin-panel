
"use client";

import * as React from "react";
// Removed unused imports: Link, useRouter, Settings, User, LogOut, Avatar, AvatarFallback, AvatarImage, DropdownMenu* related imports
// Removed unused imports: Button (if only used for dropdown trigger)

// Keep Button if used elsewhere, or remove if not needed
// import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar"; // Import SidebarTrigger for mobile toggle
import { useSidebar } from "@/components/ui/sidebar"; // Import useSidebar hook
import { ThemeToggleButton } from "@/components/theme-toggle-button"; // Import ThemeToggleButton

export function Header() {
  // Removed unused router and handleLogout function
  const { isMobile } = useSidebar(); // Get mobile status

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
       {/* Show SidebarTrigger only on mobile */}
       {isMobile && <SidebarTrigger />}

      {/* Spacer to push elements to the right */}
      <div className="flex-1"></div>

      {/* Theme Toggle Button */}
      <ThemeToggleButton />

      {/* User Dropdown Menu Removed */}
      {/*
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://picsum.photos/40/40" alt="Admin User" data-ai-hint="person avatar" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      */}
    </header>
  );
}
