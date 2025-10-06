"use client";

import React from "react";
import { Navbar } from "@/components/navbar";
import { PageWrapper } from "@/components/page-wrapper";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // GUEST MODE: Remove authentication checks
  console.log('Guest Mode: Skipping authentication checks');

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <PageWrapper>{children}</PageWrapper>
      </main>
    </div>
  );
}
