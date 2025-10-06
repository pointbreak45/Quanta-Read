import { motion } from "framer-motion";

interface ChatBubbleProps {
  sender: "user" | "ai";
  text: string;
}

export function ChatBubble({ sender, text }: ChatBubbleProps) {
  const isUser = sender === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, x: isUser ? 10 : -10 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`flex items-start gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
        <div
          className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${
            isUser
              ? "bg-teal-600 text-white rounded-br-none"
              : "bg-muted rounded-bl-none"
          }`}
        >
          <p className="text-sm">{text}</p>
        </div>
      </div>
    </motion.div>
  );
}