"use client";
import { FileCard } from "./file-card";
import { AnimatePresence } from "framer-motion";
import { useDocuments } from "@/lib/hooks";
import { useEffect } from "react";

interface DocumentListProps {
  onDocumentSelect?: (document: any) => void;
  refreshTrigger?: number;
}

export function DocumentList({ onDocumentSelect, refreshTrigger }: DocumentListProps) {
  const { documents, loading, error, refetch } = useDocuments();

  useEffect(() => {
    if (refreshTrigger) {
      refetch();
    }
  }, [refreshTrigger, refetch]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="animate-pulse bg-muted rounded-lg h-16" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-sm p-4 text-center">
        Error loading documents: {error}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-muted-foreground text-sm p-4 text-center">
        No documents uploaded yet. Upload your first PDF to get started!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {documents.map((doc, index) => {
          // Transform the document data to match FileCard expectations
          const transformedDoc = {
            id: doc.checksum,
            title: doc.title || doc.document_name,
            date: doc.created_time ? new Date(doc.created_time).toLocaleDateString() : 'Unknown',
            size: 'Unknown' // Size not available in current schema
          };
          
          return (
            <FileCard 
              key={doc.checksum} 
              document={transformedDoc} 
              index={index}
              onClick={() => onDocumentSelect && onDocumentSelect(doc)}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}
