import Link from "next/link";
import { Book } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Book className="h-6 w-6 text-teal-500" />
          <span className="font-bold">QuantaRead</span>
          <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-md">Guest Mode</span>
        </Link>
        <nav className="flex items-center space-x-4 flex-1">
          <Button variant="link" asChild>
            <Link href="/chat">Chat</Link>
          </Button>
          <Button variant="link" asChild>
            <Link href="/profile">Profile</Link>
          </Button>
        </nav>
        <div className="flex items-center justify-end space-x-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}