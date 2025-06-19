import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { EnhancedSidebar } from "@/components/layout/enhanced-sidebar";
import { DraggableContentGrid } from "@/components/content/draggable-content-grid";
import { EnhancedMemoSidebar } from "@/components/memo/enhanced-memo-sidebar";
import { SearchModal } from "@/components/search/search-modal";
import { CollabPanel } from "@/components/collaboration/collab-panel";
import { MonacoWorkspace } from "@/components/editor/monaco-workspace";
import { StatusBar } from "@/components/ui/status-bar";
import { Button } from "@/components/ui/button";
import { PanelRightOpen } from "lucide-react";
import { mockContentItems } from "@/data/mock-data";
import { ContentItem } from "@/types/content";

export default function Index() {
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'masonry' | 'grid' | 'list' | 'justified'>('masonry');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  // Sidebar states
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  
  // Modal states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCollabOpen, setIsCollabOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [memoMode, setMemoMode] = useState<'memo' | 'chat'>('memo');

  const handleItemSelect = (item: ContentItem) => {
    setSelectedItems(prev => 
      prev.includes(item.id) 
        ? prev.filter(id => id !== item.id)
        : [...prev, item.id]
    );
  };

  const filteredItems = mockContentItems.filter(item => {
    if (selectedFolder === 'all') return true;
    if (selectedFolder === 'text') return item.type === 'text';
    if (selectedFolder === 'images') return item.type === 'image';
    if (selectedFolder === 'links') return item.type === 'link';
    if (selectedFolder === 'videos') return item.type === 'video';
    return item.folderId === selectedFolder;
  });

  const getFolderName = (folderId: string) => {
    switch (folderId) {
      case 'all': return '모든 콘텐츠';
      case 'text': return '텍스트 하이라이팅';
      case 'images': return '이미지';
      case 'links': return '링크';
      case 'videos': return '동영상';
      case 'clipboard': return '클립보드';
      case 'screenshots': return '스크린샷';
      default: return '콘텐츠';
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      {/* Enhanced Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1557264337-e8a93017fe92?q=80&w=2070&auto=format&fit=crop')`
        }}
      />
      
      {/* Enhanced overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/50 backdrop-blur-[1px]" />

      {/* Enhanced Floating Glass Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary Glass Orb */}
        <motion.div
          className="absolute -top-1/4 -left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(147, 51, 234, 0.2) 50%, transparent 100%)'
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Secondary Glass Orb */}
        <motion.div
          className="absolute -bottom-1/4 -right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 100%)'
          }}
          animate={{
            x: [0, -80, 0],
            y: [0, 40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Additional floating particles */}
        <motion.div
          className="absolute top-1/3 left-1/2 w-32 h-32 rounded-full blur-2xl opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)'
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.3, 0.1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Main Layout */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <Header
          onSearchToggle={() => setIsSearchOpen(true)}
          onStickyNoteToggle={() => {
            if (window.electronAPI) {
              window.electronAPI.showStickyNote();
            }
          }}
          onCollabToggle={() => setIsCollabOpen(!isCollabOpen)}
          onRightSidebarToggle={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
          isCollabActive={isCollabOpen}
          isRightSidebarOpen={isRightSidebarOpen}
        />
        
        <div className="flex-1 flex">
          <EnhancedSidebar
            selectedFolder={selectedFolder}
            onFolderSelect={setSelectedFolder}
            isCollapsed={isLeftSidebarCollapsed}
            onToggleCollapse={() => setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed)}
          />
          
          <DraggableContentGrid
            items={filteredItems}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onItemSelect={handleItemSelect}
            selectedItems={selectedItems}
            folderName={getFolderName(selectedFolder)}
          />

          {isRightSidebarOpen ? (
            <EnhancedMemoSidebar 
              isOpen={isRightSidebarOpen}
              onClose={() => setIsRightSidebarOpen(false)}
              mode={memoMode}
              onModeChange={setMemoMode}
            />
          ) : (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="fixed right-4 top-20 z-30"
            >
              <Button
                onClick={() => setIsRightSidebarOpen(true)}
                variant="glass"
                size="icon"
                className="text-white hover:bg-white/15 h-10 w-10 backdrop-blur-xl bg-white/10 border border-white/20 rounded-full relative overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                title="사이드바 열기"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-full" />
                <div className="relative z-10">
                  <PanelRightOpen className="h-4 w-4" />
                </div>
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar isRightSidebarOpen={isRightSidebarOpen} />

      {/* Floating Components */}
      <SearchModal 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      
      <CollabPanel 
        isOpen={isCollabOpen}
        onClose={() => setIsCollabOpen(false)}
      />
      
      <MonacoWorkspace 
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
      />
    </div>
  );
}