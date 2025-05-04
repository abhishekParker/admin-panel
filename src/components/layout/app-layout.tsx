import * as React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
// Remove Header import, it will be placed within children by the page component
// import { Header } from "@/components/layout/header";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen flex-col md:flex-row"> {/* Adjust flex direction */}
        <AppSidebar />
        <SidebarInset> {/* Use SidebarInset to manage content positioning */}
          <div className="flex flex-1 flex-col"> {/* Wrapper for header and main content */}
            {/* Header will be included here via children prop */}
             {/* Main content area - removed explicit Header call */}
             <main className="flex-1"> {/* Removed padding, let page add it */}
              {children} {/* Render page content (including Header if placed there) */}
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
