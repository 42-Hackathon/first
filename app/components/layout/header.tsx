import { motion } from "framer-motion";
import { 
  Search, 
  Settings,
  Minimize2,
  Maximize2,
  X,
  StickyNote,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onSearchToggle: () => void;
  onStickyNoteToggle: () => void;
  onCollabToggle: () => void;
  onRightSidebarToggle: () => void;
  isCollabActive: boolean;
  isRightSidebarOpen: boolean;
}

export function Header({ 
  onSearchToggle, 
  onStickyNoteToggle,
  onCollabToggle,
  onRightSidebarToggle,
  isCollabActive,
  isRightSidebarOpen
}: HeaderProps) {
  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex items-center h-10 backdrop-blur-xl bg-white/[0.08] border-b border-white/10 relative overflow-hidden"
    >
      {/* Liquid Glass Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-white/10" />
      <div className="absolute inset-0 backdrop-blur-3xl bg-white/[0.02]" />
      
      <div className="relative z-10 flex items-center w-full">
        {/* Left - Tabs Area */}
        <div className="flex-1 flex items-center">
          <div className="w-72 flex items-center px-3 border-r border-white/10">
            {/* Sidebar space - no title needed */}
          </div>
          
          {/* Tabs area */}
          <div className="flex-1 flex items-center px-2">
            <div className="bg-white/10 rounded px-2 py-1 text-white text-xs backdrop-blur-xl border border-white/20">
              메인 워크스페이스
            </div>
          </div>
        </div>

        {/* Center - Search */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onSearchToggle}
            className="text-white border border-white/20 hover:bg-white/10 backdrop-blur-xl h-7 px-3 text-xs rounded-full relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent" />
            <div className="relative z-10 flex items-center">
              <Search className="h-3.5 w-3.5 mr-2" />
              검색하기...
            </div>
          </Button>
        </div>

        {/* Right - Controls */}
        <div className="flex items-center gap-1 px-3">
          <Button
            onClick={onCollabToggle}
            variant="ghost"
            size="icon"
            className={`text-white hover:bg-white/10 h-6 w-6 backdrop-blur-xl ${isCollabActive ? 'bg-white/20' : ''}`}
          >
            <Users className="h-3.5 w-3.5" />
          </Button>
          <Button
            onClick={onStickyNoteToggle}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 h-6 w-6 backdrop-blur-xl"
          >
            <StickyNote className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 h-6 w-6 backdrop-blur-xl"
          >
            <Settings className="h-3.5 w-3.5" />
          </Button>
          
          <div className="w-px h-4 bg-white/20 mx-1" />
          
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 h-5 w-5 backdrop-blur-xl"
          >
            <Minimize2 className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 h-5 w-5 backdrop-blur-xl"
          >
            <Maximize2 className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 hover:bg-red-500/20 h-5 w-5 backdrop-blur-xl"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}