import { motion } from "framer-motion";
import { 
  Search, 
  Settings,
  Minimize2,
  Maximize2,
  X,
  StickyNote,
  Users,
  Sparkles
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
      className="flex items-center h-12 backdrop-blur-2xl bg-black/20 border-b border-white/10 relative overflow-hidden"
    >
      {/* Enhanced Glass Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5" />
      <div className="absolute inset-0 backdrop-blur-3xl bg-black/10" />
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5" />
      
      <div className="relative z-10 flex items-center w-full">
        {/* Left - App Title & Navigation */}
        <div className="flex-1 flex items-center">
          <div className="w-72 flex items-center px-4 border-r border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-600 rounded-md flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-white font-semibold text-sm">Knowledge Hub</span>
            </div>
          </div>
          
          {/* Workspace indicator */}
          <div className="flex-1 flex items-center px-3">
            <div className="bg-white/10 rounded-lg px-3 py-1.5 text-white text-xs backdrop-blur-xl border border-white/20 hover:bg-white/15 transition-all duration-200">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                메인 워크스페이스
              </span>
            </div>
          </div>
        </div>

        {/* Center - Enhanced Search */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Button 
            variant="glass" 
            size="sm"
            onClick={onSearchToggle}
            className="text-white border border-white/30 hover:bg-white/15 backdrop-blur-xl h-8 px-4 text-xs rounded-full relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10 flex items-center gap-2">
              <Search className="h-3.5 w-3.5" />
              <span>검색하기...</span>
              <kbd className="pointer-events-none inline-flex h-4 select-none items-center gap-1 rounded border border-white/20 bg-white/10 px-1.5 font-mono text-[10px] font-medium text-white/70 opacity-100">
                ⌘K
              </kbd>
            </div>
          </Button>
        </div>

        {/* Right - Enhanced Controls */}
        <div className="flex items-center gap-1 px-4">
          <Button
            onClick={onCollabToggle}
            variant="ghost"
            size="xs"
            className={`text-white hover:bg-white/15 h-7 w-7 backdrop-blur-xl transition-all duration-200 ${
              isCollabActive ? 'bg-white/20 ring-1 ring-white/30' : ''
            }`}
            title="실시간 협업"
          >
            <Users className="h-3.5 w-3.5" />
          </Button>
          
          <Button
            onClick={onStickyNoteToggle}
            variant="ghost"
            size="xs"
            className="text-white hover:bg-white/15 h-7 w-7 backdrop-blur-xl transition-all duration-200"
            title="스티키 노트"
          >
            <StickyNote className="h-3.5 w-3.5" />
          </Button>
          
          <Button
            variant="ghost"
            size="xs"
            className="text-white hover:bg-white/15 h-7 w-7 backdrop-blur-xl transition-all duration-200"
            title="설정"
          >
            <Settings className="h-3.5 w-3.5" />
          </Button>
          
          <div className="w-px h-5 bg-white/20 mx-1" />
          
          {/* Window Controls */}
          <Button
            variant="ghost"
            size="xs"
            className="text-white hover:bg-white/15 h-6 w-6 backdrop-blur-xl transition-all duration-200"
            title="최소화"
          >
            <Minimize2 className="h-3 w-3" />
          </Button>
          
          <Button
            variant="ghost"
            size="xs"
            className="text-white hover:bg-white/15 h-6 w-6 backdrop-blur-xl transition-all duration-200"
            title="최대화"
          >
            <Maximize2 className="h-3 w-3" />
          </Button>
          
          <Button
            variant="ghost"
            size="xs"
            className="text-white hover:bg-white/15 hover:bg-red-500/20 h-6 w-6 backdrop-blur-xl transition-all duration-200"
            title="닫기"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}