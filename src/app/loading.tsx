
import * as React from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// This loading UI will be displayed automatically by Next.js
// when navigating between routes within the app directory.
export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <LoadingSpinner className="h-12 w-12 text-primary" />
    </div>
  );
}
