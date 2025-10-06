import { motion } from "framer-motion";
import { FileText, CalendarDays, HardDrive } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type Document = { id: string; title: string; date: string; size: string };

interface FileCardProps {
  document: Document;
  index: number;
  onClick?: () => void;
}

export function FileCard({ document, index, onClick }: FileCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card 
        className={`hover:bg-muted/50 transition-colors ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
      >
        <CardHeader className="p-4">
          <CardTitle className="text-base flex items-start gap-2">
            <FileText className="h-5 w-5 mt-0.5 text-teal-500 flex-shrink-0" />
            <span className="break-all">{document.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 text-sm text-muted-foreground flex justify-between">
          <div className="flex items-center gap-1">
            <CalendarDays className="h-3 w-3" />
            <span>{document.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <HardDrive className="h-3 w-3" />
            <span>{document.size}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}