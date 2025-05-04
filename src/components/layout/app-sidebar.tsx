"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Table, ClipboardEdit, Settings, User, LogOut } from "lucide-react"; // Import LogOut

import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  tooltip: string;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, label, tooltip }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <SidebarMenuItem>
      <Link href={href} passHref legacyBehavior>
        <SidebarMenuButton
          asChild
          isActive={isActive}
          tooltip={{ children: tooltip, side: "right", align: "center" }}
        >
          <a>
            <Icon />
            <span>{label}</span>
          </a>
        </SidebarMenuButton>
      </Link>
    </SidebarMenuItem>
  );
};

export function AppSidebar() {
  const router = useRouter(); // Initialize router

  const handleLogout = () => {
    console.log("Logout clicked");
    // Add actual logout logic here (e.g., clearing auth tokens, redirecting)
    router.push('/login'); // Redirect to login page after logout
  };

  return (
    <Sidebar variant="sidebar" collapsible="icon" side="left" className="border-r">
      <SidebarHeader className="items-center justify-between p-3">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-lg group-data-[collapsible=icon]:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <span className="transition-opacity duration-200 ease-in-out">Visionary</span>
        </Link>
        <div className="group-data-[collapsible=icon]:hidden">
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-1 overflow-y-auto">
        <SidebarMenu>
            <NavItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" tooltip="Dashboard Overview" />
            <NavItem href="/data-tables" icon={Table} label="Data Tables" tooltip="View and Manage Data" />
            <NavItem href="/form-builder" icon={ClipboardEdit} label="Form Builder" tooltip="Create and Manage Forms" />
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-3 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center justify-start gap-2 w-full px-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:p-0">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://picsum.photos/40/40" alt="Admin User" data-ai-hint="person avatar" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <span className="group-data-[collapsible=icon]:hidden">Admin User</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" className="w-56">
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
            <DropdownMenuItem onClick={handleLogout}> {/* Add onClick handler */}
              <LogOut className="mr-2 h-4 w-4" /> {/* Add LogOut icon */}
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
