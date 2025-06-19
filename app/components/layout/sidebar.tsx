import { motion } from "framer-motion";
import { 
  Folder, 
  FolderOpen, 
  Search, 
  Star, 
  Archive, 
  Tag,
  Plus,
  Settings,
  Users,
  MessageCircle
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Folder as FolderType } from "@/types/content";

interface SidebarProps {
  folders: FolderType[];
  selectedFolder?: string;
  onFolderSelect: (folderId: string) => void;
  onChatToggle: () => void;
  isChatOpen: boolean;
}

export function Sidebar({ folders, selectedFolder, onFolderSelect, onChatToggle, isChatOpen }: SidebarProps) {
  const defaultFolders = [
    { id: 'all', name: 'All Content', icon: Archive, count: 124 },
    { id: 'review', name: 'Review', icon: Star, count: 23 },
    { id: 'refine', name: 'Refine', icon: FolderOpen, count: 45 },
    { id: 'consolidate', name: 'Consolidate', icon: Folder, count: 56 },
  ];

  return (
    <motion.div
      className="w-80 h-full flex flex-col"
      initial={{ x: -320 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <GlassCard className="m-4 p-6 flex-1">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Collections</h2>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onChatToggle}
              className={`text-white hover:bg-white/10 ${isChatOpen ? 'bg-white/20' : ''}`}
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
          <Input
            placeholder="Search collections..."
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
          />
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-2">
            <div className="text-sm font-medium text-white/80 mb-3">Quick Access</div>
            {defaultFolders.map((folder) => {
              const Icon = folder.icon;
              return (
                <Button
                  key={folder.id}
                  variant={selectedFolder === folder.id ? "secondary" : "ghost"}
                  className={`w-full justify-start text-white hover:bg-white/10 ${
                    selectedFolder === folder.id ? 'bg-white/20' : ''
                  }`}
                  onClick={() => onFolderSelect(folder.id)}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  <span className="flex-1 text-left">{folder.name}</span>
                  <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                    {folder.count}
                  </Badge>
                </Button>
              );
            })}

            <Separator className="my-4 bg-white/20" />

            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-white/80">Custom Folders</div>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-white/60 hover:bg-white/10">
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            {folders.map((folder) => (
              <Button
                key={folder.id}
                variant={selectedFolder === folder.id ? "secondary" : "ghost"}
                className={`w-full justify-start text-white hover:bg-white/10 ${
                  selectedFolder === folder.id ? 'bg-white/20' : ''
                }`}
                onClick={() => onFolderSelect(folder.id)}
              >
                <div 
                  className="h-3 w-3 rounded-full mr-3"
                  style={{ backgroundColor: folder.color }}
                />
                <span className="flex-1 text-left">{folder.name}</span>
                <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                  {folder.itemCount}
                </Badge>
              </Button>
            ))}

            <Separator className="my-4 bg-white/20" />

            <div className="text-sm font-medium text-white/80 mb-3">Smart Folders</div>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-white/10"
            >
              <Tag className="h-4 w-4 mr-3" />
              <span className="flex-1 text-left">Important</span>
              <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                12
              </Badge>
            </Button>
          </div>
        </ScrollArea>

        <div className="mt-6 pt-4 border-t border-white/20">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 border-2 border-white/20"
                />
              ))}
            </div>
            <div className="text-sm text-white/80">3 collaborators online</div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}