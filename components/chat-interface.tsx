"use client";
import React, { useState, useRef, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Send, FileText, Download } from "lucide-react";
import { ChatBubble } from "./chat-bubble";
import { AnimatePresence } from "framer-motion";
import { useChatRecords } from "@/lib/hooks";

interface ChatInterfaceProps {
  selectedDocument?: any;
}

export function ChatInterface({ selectedDocument }: ChatInterfaceProps) {
  const { messages, loading, setMessages } = useChatRecords(selectedDocument?.checksum || null);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Transform messages from the API format to component format
  const transformedMessages = messages.map(msg => ({
    id: msg.id,
    sender: (msg.actor === 'user' ? 'user' : 'ai') as 'user' | 'ai',
    text: msg.message
  }));

  const handleSend = async () => {
    if (input.trim() === "" || !selectedDocument) return;
    
    setIsSending(true);
    const userMessage = { id: Date.now(), sender: "user" as const, text: input };
    const currentMessages = [...transformedMessages, userMessage];
    setMessages([...messages, {
      id: userMessage.id,
      actor: 'user',
      message: input,
      created_at: new Date().toISOString()
    }]);
    setInput("");

    try {
      // Send message to the inference API
      const response = await fetch('/api/inference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          checksum: selectedDocument.checksum,
          conversationHistory: currentMessages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
          }))
        })
      });

      if (response.ok) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let aiResponse = "";
        const aiMessageId = Date.now() + 1;

        // Add AI message placeholder
        setMessages(prev => [...prev, {
          id: aiMessageId,
          actor: 'assistant',
          message: '',
          created_at: new Date().toISOString()
        }]);

        let streamDone = false;
        while (!streamDone) {
          const { done, value } = await reader!.read();
          if (done) {
            streamDone = true;
            break;
          }
          
          const chunk = decoder.decode(value);
          aiResponse += chunk;
          
          // Update the AI message as we stream
          setMessages(prev => prev.map(msg => 
            msg.id === aiMessageId 
              ? { ...msg, message: aiResponse }
              : msg
          ));
        }
      } else {
        // Handle error
        const aiErrorMessage = {
          id: Date.now() + 1,
          actor: 'assistant',
          message: 'Sorry, I encountered an error processing your request.',
          created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, aiErrorMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const aiErrorMessage = {
        id: Date.now() + 1,
        actor: 'assistant',
        message: 'Sorry, I encountered an error. Please try again.',
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiErrorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSummarize = async () => {
    if (!selectedDocument) return;
    
    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          checksum: selectedDocument.checksum
        })
      });
      
      const data = await response.json();
      if (response.ok) {
        const summaryMessage = {
          id: Date.now(),
          actor: 'assistant',
          message: `Document Summary: ${data.summary}`,
          created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, summaryMessage]);
      }
    } catch (error) {
      console.error('Summary error:', error);
    }
  };

  const handleExportChat = async () => {
    if (!selectedDocument) return;
    
    try {
      const response = await fetch('/api/export-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          checksum: selectedDocument.checksum
        })
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-${selectedDocument.title || selectedDocument.document_name}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  if (!selectedDocument) {
    return (
      <Card className="flex flex-col h-full w-full shadow-lg">
        <div className="flex items-center justify-center p-8">
          <p className="text-muted-foreground text-center">
            Select a document to start chatting about it.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-full w-full shadow-lg">
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h2 className="text-xl font-semibold">Chat</h2>
          <p className="text-sm text-muted-foreground">
            {selectedDocument.title || selectedDocument.document_name}
          </p>
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={handleSummarize} disabled={loading}>
            <FileText className="mr-2 h-4 w-4" /> Summarize
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportChat}>
            <Download className="mr-2 h-4 w-4" /> Export Chat
          </Button>
        </div>
      </div>
      
      <div ref={scrollAreaRef} className="flex-grow p-4 space-y-4 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" />
          </div>
        ) : (
          <AnimatePresence>
            {transformedMessages.length === 0 ? (
              <div className="text-center text-muted-foreground">
                <p>No messages yet. Ask me anything about this document!</p>
              </div>
            ) : (
              transformedMessages.map((msg) => (
                <ChatBubble key={msg.id} sender={msg.sender} text={msg.text} />
              ))
            )}
          </AnimatePresence>
        )}
      </div>

      <div className="p-4 border-t">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about this document..."
            disabled={isSending}
          />
          <Button 
            type="submit" 
            className="bg-teal-600 hover:bg-teal-700" 
            disabled={isSending || input.trim() === ""}
          >
            {isSending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </Card>
  );
}