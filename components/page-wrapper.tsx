import React from "react";
import { cn } from "@/lib/utils"

interface PageWrapperProps {
  children: React.ReactNode
  className?: string
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <div className={cn("container mx-auto max-w-7xl px-4 py-6", className)}>
      {children}
    </div>
  )
}