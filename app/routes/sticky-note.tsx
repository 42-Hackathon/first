import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  X, 
  Minus, 
  Pin, 
  Camera, 
  Clipboard,
  Plus,
  Palette
} from "lucide-react";

declare global {
  interface Window {
    stickyNoteAPI?: {
      close: () => void;
      minimize: () => void;
      saveNote: (content: string) => void;
      loadNote: () => Promise<string>;
      addToCollection: (content: any) => void;
      quickCapture: () => void;
    };
  }
}

export default function StickyNote() {
  const [content, setContent] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    // Load saved note content
    if (window.stickyNoteAPI) {
      window.stickyNoteAPI.loadNote().then(savedContent => {
        if (savedContent) {
          setContent(savedContent);
        }
      });
    }
  }, []);

  const handleSave = () => {
    if (window.stickyNoteAPI) {
      window.stickyNoteAPI.saveNote(content);
    }
  };

  const handleClose = () => {
    handleSave();
    if (window.stickyNoteAPI) {
      window.stickyNoteAPI.close();
    }
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    if (window.stickyNoteAPI) {
      window.stickyNoteAPI.minimize();
    }
  };

  const handleQuickCapture = () => {
    if (window.stickyNoteAPI) {
      window.stickyNoteAPI.quickCapture();
    }
  };

  const handleAddToCollection = () => {
    if (content.trim() && window.stickyNoteAPI) {
      window.stickyNoteAPI.addToCollection({
        type: 'text',
        content: content,
        title: content.split('\n')[0] || 'Quick Note',
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <div className="h-screen w-screen bg-transparent">
      <motion.div
        className="h-full w-full"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isMinimized ? 0.3 : 1, 
          scale: isMinimized ? 0.8 : 1 
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <GlassCard className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-white/20">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsPinned(!isPinned)}
                className={`h-6 w-6 text-white/70 hover:bg-white/10 ${
                  isPinned ? 'bg-white/20' : ''
                }`}
              >
                <Pin className="h-3 w-3" />
              </Button>
              <span className="text-xs text-white/70">Quick Note</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleMinimize}
                className="h-6 w-6 text-white/70 hover:bg-white/10"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-6 w-6 text-white/70 hover:bg-white/10"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-3">
            <Textarea
              placeholder="Quick notes, ideas, reminders..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onBlur={handleSave}
              className="h-full resize-none bg-transparent border-none text-white placeholder:text-white/50 focus:ring-0 focus:outline-none"
            />
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleQuickCapture}
                  className="h-6 w-6 text-white/70 hover:bg-white/10"
                  title="Quick Capture"
                >
                  <Camera className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-white/70 hover:bg-white/10"
                  title="Clipboard"
                >
                  <Clipboard className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-white/70 hover:bg-white/10"
                  title="Color"
                >
                  <Palette className="h-3 w-3" />
                </Button>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleAddToCollection}
                disabled={!content.trim()}
                className="h-6 w-6 text-white/70 hover:bg-white/10 disabled:opacity-30"
                title="Add to Collection"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}