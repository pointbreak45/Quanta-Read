"use client";

import { useState, useEffect } from "react";
import { supabaseClient } from "@/lib/supabase-client";

export function DebugPanel() {
  const [authStatus, setAuthStatus] = useState('Checking...');
  const [user, setUser] = useState(null);
  const [connectionTest, setConnectionTest] = useState('Not tested');
  const [envVars, setEnvVars] = useState<Record<string, string>>({});

  useEffect(() => {
    checkAuth();
    checkEnvVars();
  }, []);

  const checkAuth = async () => {
    // GUEST MODE: Always show as authenticated with guest user
    setAuthStatus('Guest Mode: Always authenticated');
    setUser({ id: '00000000-0000-0000-0000-000000000000', email: 'guest@localhost' });
  };

  const checkEnvVars = () => {
    setEnvVars({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing',
      documentsTable: process.env.NEXT_PUBLIC_SUPABASE_DOCUMENTS_TABLE || 'documents (default)',
      bucket: process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'documents (default)'
    });
  };

  const testConnection = async () => {
    setConnectionTest('Testing...');
    try {
      const response = await fetch('/api/test-connection');
      const result = await response.json();
      if (response.ok) {
        setConnectionTest('✅ Connection successful');
      } else {
        setConnectionTest(`❌ Connection failed: ${result.error}`);
      }
    } catch (err) {
      setConnectionTest(`❌ Test failed: ${err.message}`);
    }
  };

  const testDocumentsFetch = async () => {
    try {
      const { data, error } = await supabaseClient
        .from('documents')
        .select('checksum, document_name, title, created_time')
        .limit(5);
      
      if (error) {
        alert(`Documents fetch error: ${error.message}`);
      } else {
        alert(`Documents fetch successful: Found ${data?.length || 0} documents`);
        console.log('Documents:', data);
      }
    } catch (err) {
      alert(`Documents fetch failed: ${err.message}`);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg max-w-sm text-xs">
      <div className="font-bold mb-2">🔧 Debug Panel</div>
      
      <div className="mb-2">
        <strong>Auth Status:</strong> {authStatus}
        {user && <div>User ID: {user.id.substring(0, 8)}...</div>}
      </div>

      <div className="mb-2">
        <strong>Environment:</strong>
        {Object.entries(envVars).map(([key, value]) => (
          <div key={key}>{key}: {String(value)}</div>
        ))}
      </div>

      <div className="mb-2">
        <strong>Connection:</strong> {connectionTest}
      </div>

      <div className="space-y-1">
        <button 
          onClick={testConnection}
          className="bg-blue-600 px-2 py-1 rounded text-xs w-full"
        >
          Test Connection
        </button>
        <button 
          onClick={testDocumentsFetch}
          className="bg-green-600 px-2 py-1 rounded text-xs w-full"
        >
          Test Documents Fetch
        </button>
        <button 
          onClick={checkAuth}
          className="bg-purple-600 px-2 py-1 rounded text-xs w-full"
        >
          Refresh Auth
        </button>
      </div>
    </div>
  );
}