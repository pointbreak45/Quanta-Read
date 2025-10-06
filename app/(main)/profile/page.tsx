"use client";

import { DocumentList } from "@/components/document-list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut } from "lucide-react";
import { useUser } from "@/lib/hooks";
import { useState } from "react";

export default function ProfilePage() {
  const { user } = useUser(); // Guest mode user
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSignOut = async () => {
    console.log('Guest mode: Sign out not applicable');
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Profile (Guest Mode)</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* User Info Card */}
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-col items-center text-center">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage src="" />
              <AvatarFallback>GU</AvatarFallback>
            </Avatar>
            <CardTitle>{user.user_metadata?.full_name || 'Guest User'}</CardTitle>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </CardHeader>
          <CardContent>
            <Button onClick={handleSignOut} variant="outline" className="w-full" disabled>
              <LogOut className="mr-2 h-4 w-4" />
              Guest Mode (No Logout)
            </Button>
          </CardContent>
        </Card>

        {/* User Documents Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>My Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <DocumentList refreshTrigger={refreshTrigger} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}