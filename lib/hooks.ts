"use client";

import { useState, useEffect } from "react";
import { supabaseClient } from "./supabase-client";

interface Document {
  checksum: string;
  document_name: string;
  title?: string;
  created_time?: string;
}

// GUEST MODE: Mock user for guest mode
const GUEST_USER = {
  id: "00000000-0000-0000-0000-000000000000",
  email: "guest@localhost",
  user_metadata: {
    full_name: "Guest User"
  }
};

// Hook to get the current user and auth functions (Guest Mode)
export const useUser = () => {
  const [user, setUser] = useState(GUEST_USER);
  const [loading, setLoading] = useState(false); // No loading in guest mode

  const signOut = async () => {
    console.log('Guest mode: Sign out not applicable');
  };

  return { user, loading, signOut };
};

// Hook to fetch documents for the current user (Guest Mode)
export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        console.log('Fetching documents via API');
        const response = await fetch('/api/documents');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch documents');
        }
        
        console.log('Fetched documents:', data);
        setDocuments(data || []);
      } catch (err) {
        console.error('Error fetching documents:', err);
        const errorMessage = err instanceof Error ? err.message : 'An error occurred while loading documents';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const refetch = () => {
    setLoading(true);
    setError(null);
    // Re-run the effect
    const fetchDocuments = async () => {
      try {
        console.log('Refetching documents via API');
        const response = await fetch('/api/documents');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch documents');
        }
        
        console.log('Refetched documents:', data);
        setDocuments(data || []);
      } catch (err) {
        console.error('Error fetching documents:', err);
        const errorMessage = err instanceof Error ? err.message : 'An error occurred while loading documents';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  };

  return { documents, loading, error, refetch };
};

// Hook to fetch chat records for a document
export const useChatRecords = (checksum: string | null) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!checksum) return;

    const fetchChatRecords = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/chat-records', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ checksum })
        });
        const data = await response.json();
        if (response.ok) {
          setMessages(data || []);
        }
      } catch (error) {
        console.error('Error fetching chat records:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatRecords();
  }, [checksum]);

  return { messages, loading, setMessages };
};
