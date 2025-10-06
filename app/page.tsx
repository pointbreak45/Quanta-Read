"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-background">
      {/* Background Gradient & Shapes */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-teal-900/30 via-background to-purple-900/30"></div>
      <div
        className="absolute top-0 left-0 w-full h-full bg-no-repeat bg-contain opacity-20"
        style={{
          backgroundImage: "url(/geometric-shape.svg)",
          backgroundPosition: "top 10% left 20%, bottom 10% right 20%",
          backgroundSize: "200px, 300px"
        }}
      ></div>

      <main className="relative z-10 flex flex-col items-center justify-center text-center p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-500">
            QuantaRead
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-md">
            Read Smarter. Understand Faster.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="mt-8">
            <Button asChild size="lg" className="bg-teal-600 hover:bg-teal-700 text-white">
              <Link href="/chat">Start Chat</Link>
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}