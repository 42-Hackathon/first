import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Folder, 
  FolderOpen, 
  Archive, 
  FileText,
  Image,
  Link,
  Video,
  Clipboard,
  Camera,
  Plus,
  ChevronRight,
  MoreHorizontal,
  HardDrive,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface EnhancedSidebarProps {
  selectedFolder?: string;
  onFolderSelect: (folderId: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface FolderItem {
  id: string;
  name: string;
  icon: any;
  count: number;
  children?: FolderItem[];
  isExpanded?: boolean;
}

export function EnhancedSidebar({ 
  selectedFolder, 
  onFolderSelect, 
  isCollapsed = false, 
  onToggleCollapse 
}: EnhancedSidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['categories']));

  const folderStructure: FolderItem[] = [
    {
      id: 'all',
      name: '모든 콘텐츠',
      icon: Archive,
      count: 1247
    },
    {
      id: 'categories',
      name: '카테고리',
      icon: Folder,
      count: 0,
      children: [
        {
          id: 'text',
          name: '텍스트 하이라이팅',
          icon: FileText,
          count: 456
        },
        {
          id: 'links',
          name: '링크',
          icon: Link,
          count: 234
        },
        {
          id: 'images',
          name: '이미지',
          icon: Image,
          count: 189
        },
        {
          id: 'videos',
          name: '동영상',
          icon: Video,
          count: 67
        },
        {
          id: 'clipboard',
          name: '클립보드',
          icon: Clipboard,
          count: 123
        },
        {
          id: 'screenshots',
          name: '스크린샷',
          icon: Camera,
          count: 178
        }
      ]
    },
    {
      id: 'custom',
      name: '사용자 폴더',
      icon: FolderOpen,
      count: 0,
      children: [
        {
          id: 'project-a',
          name: '프로젝트 A',
          icon: Folder,
          count: 45
        },
        {
          id: 'research',
          name: '리서치',
          icon: Folder,
          count: 78
        }
      ]
    }
  ];

  const toggleFolder = (folderId: string) => {
    if (isCollapsed) return;
    
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFolderItem = (item: FolderItem, level: number = 0) => {
    const Icon = item.icon;
    const isExpanded = expandedFolders.has(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const isSelected = selectedFolder === item.id;

    if (isCollapsed) {
      return (
        <div key={item.id} className="mb-1">
          <Button
            variant={isSelected ? "secondary" : "ghost"}
            size="icon"
            className={`w-8 h-8 text-white/90 hover:text-white hover:bg-white/[0.15] transition-all duration-200 ${
              isSelected ? 'bg-white/[0.25] text-white shadow-lg backdrop-blur-xl' : ''
            }`}
            onClick={() => !hasChildren && onFolderSelect(item.id)}
            title={item.name}
          >
            <Icon className="h-4 w-4" />
          </Button>
        </div>
      );
    }

    return (
      <div key={item.id}>
        <Button
          variant={isSelected ? "secondary" : "ghost"}
          className={`w-full justify-start text-white/80 hover:text-white hover:bg-white/[0.12] h-7 px-2 text-xs transition-all duration-200 ${
            isSelected ? 'bg-white/[0.2] text-white shadow-md backdrop-blur-xl border border-white/[0.15]' : ''
          }`}
          style={{ paddingLeft: `${8 + level * 12}px` }}
          onClick={() => {
            if (hasChildren) {
              toggleFolder(item.id);
            } else {
              onFolderSelect(item.id);
            }
          }}
        >
          {hasChildren && (
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.15 }}
              className="mr-0"
            >
              <ChevronRight className="h-2.5 w-2.5" />
            </motion.div>
          )}
          <Icon className="h-3 w-3 mr-0.5 flex-shrink-0" />
          <span className="flex-1 text-left truncate">{item.name}</span>
          {item.count > 0 && (
            <Badge 
              variant="secondary" 
              className="bg-white/[0.25] text-white/90 text-[10px] px-1.5 py-0 h-3.5 ml-0.5 border border-white/[0.2] backdrop-blur-xl"
            >
              {item.count}
            </Badge>
          )}
        </Button>

        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <div className="space-y-0.5">
                {item.children?.map(child => renderFolderItem(child, level + 1))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <motion.div
      className={`h-full flex flex-col border-r border-white/[0.15] ${isCollapsed ? 'w-12' : 'w-72'}`}
      initial={false}
      animate={{ width: isCollapsed ? 48 : 288 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Apple Liquid Glass Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/[0.15] via-cyan-300/[0.08] to-blue-600/[0.12]" />
        <div className="absolute inset-0 backdrop-blur-3xl" />
        <div className="absolute inset-0 bg-white/[0.03]" />
        
        {/* Subtle Glass Reflections */}
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/[0.08] to-transparent" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-blue-300/[0.05] to-transparent" />
        
        <div className="relative z-10 flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-white/[0.15]">
            {!isCollapsed && (
              <h2 className="text-sm font-semibold text-white/90">폴더</h2>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className="text-white/80 hover:text-white hover:bg-white/[0.15] h-6 w-6 transition-all duration-200"
            >
              {isCollapsed ? <PanelLeftOpen className="h-3.5 w-3.5" /> : <PanelLeftClose className="h-3.5 w-3.5" />}
            </Button>
          </div>

          {/* Folder Tree */}
          <ScrollArea className="flex-1 p-3">
            <div className={`space-y-0.5 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
              {folderStructure.map(folder => renderFolderItem(folder))}
            </div>
          </ScrollArea>

          {/* Cloud Storage - Apple Style */}
          {!isCollapsed && (
            <div className="border-t border-white/[0.15] p-1.5 relative">
              {/* Glass Background for Storage Section */}
              <div className="absolute inset-0 bg-white/[0.05] backdrop-blur-xl" />
              
              <div className="relative z-10 bg-white/[0.08] rounded-lg p-1.5 backdrop-blur-xl border border-white/[0.12] shadow-lg">
                <div className="flex items-center gap-0.5 mb-1">
                  <HardDrive className="h-2.5 w-2.5 text-white/70" />
                  <span className="text-white/70 text-[10px] font-medium">클라우드 용량</span>
                </div>
                
                {/* Progress Bar - Apple Style */}
                <div className="w-full bg-white/[0.15] rounded-full h-1 mb-1 overflow-hidden backdrop-blur-xl border border-white/[0.1]">
                  <motion.div 
                    className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 h-1 rounded-full shadow-sm relative overflow-hidden"
                    style={{ width: '68%' }}
                    initial={{ width: 0 }}
                    animate={{ width: '68%' }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  >
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.3] to-transparent animate-pulse" />
                  </motion.div>
                </div>
                
                <div className="text-white/80 text-[9px] flex justify-between font-medium">
                  <span>6.8GB</span>
                  <span className="text-white/60">10GB</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}