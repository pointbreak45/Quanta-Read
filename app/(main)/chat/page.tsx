"use client";

import { ChatInterface } from "@/components/chat-interface";
import { DocumentList } from "@/components/document-list";
import { FileUpload } from "@/components/file-upload";
import { Separator } from "@/components/ui/separator";
import { DebugPanel } from "@/components/debug-panel";
import { useState } from "react";

export default function ChatPage() {
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleDocumentSelect = (document: any) => {
    setSelectedDocument(document);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-80px)] p-4 md:p-6">
      {/* Left Sidebar */}
      <aside className="lg:col-span-1 flex flex-col gap-6 p-4 bg-muted/30 rounded-lg overflow-y-auto">
        <div>
          <h2 className="text-xl font-semibold mb-4">Upload Documents</h2>
          <FileUpload onUploadSuccess={handleUploadSuccess} />
        </div>
        <Separator />
        <div>
          <h3 className="text-lg font-semibold mb-4">Your Library</h3>
          <DocumentList 
            onDocumentSelect={handleDocumentSelect}
            refreshTrigger={refreshTrigger}
          />
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="lg:col-span-2 flex flex-col h-full">
        <ChatInterface selectedDocument={selectedDocument} />
      </main>
      
      {/* Debug Panel */}
      <DebugPanel />
    </div>
  );
}
