import { useState, useCallback, useEffect } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { Header } from "@/components/layout/header";
import { EnhancedSidebar } from "@/components/layout/enhanced-sidebar";
import { DraggableContentGrid } from "@/components/content/draggable-content-grid";
import { EnhancedMemoSidebar } from "@/components/memo/enhanced-memo-sidebar";
import { SearchModal } from "@/components/search/search-modal";
import { MonacoWorkspace } from "@/components/editor/monaco-workspace";
import { StatusBar } from "@/components/ui/status-bar";
import { Button } from "@/components/ui/button";
import { PanelRightOpen } from "lucide-react";
import { mockContentItems } from "@/data/mock-data";
import { ContentItem } from "@/types/content";
import { AnimatePresence } from "framer-motion";

export default function Index() {
  const [items, setItems] = useState<ContentItem[]>(mockContentItems);
  const [viewMode, setViewMode] = useState<'masonry' | 'grid' | 'list' | 'justified'>('masonry');
  const [selectedFolder, setSelectedFolder] = useState('all');
  
  const [openTabs, setOpenTabs] = useState<ContentItem[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [cursorPosition, setCursorPosition] = useState({ lineNumber: 1, column: 1 });
  const [isCollabActive, setIsCollabActive] = useState(false);

  // 좌측 사이드바 리사이즈 상태
  const leftSidebarWidth = useMotionValue(288);
  const [isLeftResizing, setIsLeftResizing] = useState(false);

  // 우측 사이드바 리사이즈 상태
  const rightSidebarWidth = useMotionValue(320);
  const [isRightResizing, setIsRightResizing] = useState(false);

  // Modal states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [memoMode, setMemoMode] = useState<'memo' | 'chat'>('memo');

  // 좌측 사이드바 리사이즈 핸들러
  const handleLeftResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLeftResizing(true);
  };

  const handleLeftResizeMouseMove = useCallback((e: MouseEvent) => {
    if (isLeftResizing) {
      const newWidth = e.clientX;
      const minWidth = 240;
      const maxWidth = 500;
      
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        leftSidebarWidth.set(newWidth);
        
        // 70px 이상이면 자동으로 확장 모드로 전환
        if (newWidth > 70 && isLeftSidebarCollapsed) {
          setIsLeftSidebarCollapsed(false);
        }
      }
    }
  }, [isLeftResizing, leftSidebarWidth, isLeftSidebarCollapsed]);

  const handleLeftResizeMouseUp = useCallback(() => {
    setIsLeftResizing(false);
  }, []);

  // 우측 사이드바 리사이즈 핸들러
  const handleRightResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsRightResizing(true);
  };

  const handleRightResizeMouseMove = useCallback((e: MouseEvent) => {
    if (isRightResizing) {
      const newWidth = window.innerWidth - e.clientX;
      const minWidth = 280;
      const maxWidth = 600;
      
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        rightSidebarWidth.set(newWidth);
      }
    }
  }, [isRightResizing, rightSidebarWidth]);

  const handleRightResizeMouseUp = useCallback(() => {
    setIsRightResizing(false);
  }, []);

  // 마우스 이벤트 리스너 등록
  useEffect(() => {
    if (isLeftResizing) {
      window.addEventListener('mousemove', handleLeftResizeMouseMove);
      window.addEventListener('mouseup', handleLeftResizeMouseUp);
    } else {
      window.removeEventListener('mousemove', handleLeftResizeMouseMove);
      window.removeEventListener('mouseup', handleLeftResizeMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleLeftResizeMouseMove);
      window.removeEventListener('mouseup', handleLeftResizeMouseUp);
    };
  }, [isLeftResizing, handleLeftResizeMouseMove, handleLeftResizeMouseUp]);

  useEffect(() => {
    if (isRightResizing) {
      window.addEventListener('mousemove', handleRightResizeMouseMove);
      window.addEventListener('mouseup', handleRightResizeMouseUp);
    } else {
      window.removeEventListener('mousemove', handleRightResizeMouseMove);
      window.removeEventListener('mouseup', handleRightResizeMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleRightResizeMouseMove);
      window.removeEventListener('mouseup', handleRightResizeMouseUp);
    };
  }, [isRightResizing, handleRightResizeMouseMove, handleRightResizeMouseUp]);

  const handleLeftResetWidth = () => {
    animate(leftSidebarWidth, 288, { type: "spring", stiffness: 400, damping: 30 });
    setIsLeftSidebarCollapsed(false);
  };

  const handleRightResetWidth = () => {
    animate(rightSidebarWidth, 320, { type: "spring", stiffness: 400, damping: 30 });
  };

  const handleItemSelect = (item: ContentItem) => {
    if (!openTabs.find(tab => tab.id === item.id)) {
      setOpenTabs(prevTabs => [...prevTabs, item]);
    }
    setActiveTabId(item.id);
  };

  const handleCloseTab = (tabId: string) => {
    const newTabs = openTabs.filter(tab => tab.id !== tabId);
    setOpenTabs(newTabs);

    if (activeTabId === tabId) {
      if (newTabs.length > 0) {
        setActiveTabId(newTabs[newTabs.length - 1].id);
      } else {
        setActiveTabId(null);
      }
    }
  };

  const handleFolderSelect = (folderId: string) => {
    setSelectedFolder(folderId);
    if (folderId === 'all') {
      setItems(mockContentItems);
    } else {
      setItems(items.filter(item => item.folderId === folderId));
    }
  };

  const getFolderName = (folderId: string) => {
    switch (folderId) {
      case 'all': return '모든 콘텐츠';
      case 'text': return '텍스트 하이라이팅';
      case 'images': return '이미지';
      case 'links': return '링크';
      case 'videos': return '동영상';
      case 'clipboard': return '클립보드';
      case 'screenshots': return '스크린샷';
      default: {
        const folder = items.find(item => item.folderId === folderId);
        return folder?.title ?? '콘텐츠';
      }
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 5, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 5, 50));
  };

  const handleCollabToggle = () => {
    setIsCollabActive(prev => !prev);
  };

  const filteredItems = items.filter(item => {
    if (selectedFolder === 'all') return true;
    if (selectedFolder === 'text') return item.type === 'text';
    if (selectedFolder === 'images') return item.type === 'image';
    if (selectedFolder === 'links') return item.type === 'link';
    if (selectedFolder === 'videos') return item.type === 'video';
    return item.folderId === selectedFolder;
  });

  const isLeftSidebarOpen = leftSidebarWidth.get() > 70;

  return (
    <div 
      className="h-screen w-screen overflow-hidden relative bg-cover bg-center"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1620121692029-d088224ddc74')",
      }}
    >
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
          zoomLevel={zoomLevel}
          openTabs={openTabs}
          activeTabId={activeTabId}
          onTabChange={setActiveTabId}
          onTabClose={handleCloseTab}
        />
        
        <div className="flex-1 flex">
          {/* 좌측 사이드바 */}
          {isLeftSidebarOpen && (
            <EnhancedSidebar 
              width={leftSidebarWidth}
              onResizeMouseDown={handleLeftResizeMouseDown}
              onResetWidth={handleLeftResetWidth}
              selectedFolder={selectedFolder}
              onFolderSelect={handleFolderSelect}
              isCollapsed={isLeftSidebarCollapsed}
              onToggleCollapse={() => setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed)}
              isCollabActive={isCollabActive}
              onCollabToggle={handleCollabToggle}
              zoomLevel={zoomLevel}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              cursorPosition={cursorPosition}
            />
          )}
          
          {/* 메인 콘텐츠 영역 */}
          <div className="flex-1 flex">
            {activeTabId ? (
              <div className="flex-1 p-4">
                <h1 className="text-2xl font-bold">{openTabs.find(t => t.id === activeTabId)?.title}</h1>
                <p className="mt-4 whitespace-pre-wrap">{openTabs.find(t => t.id === activeTabId)?.content}</p>
              </div>
            ) : (
              <DraggableContentGrid
                items={filteredItems}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onItemSelect={handleItemSelect}
                selectedItems={[]}
                folderName={getFolderName(selectedFolder)}
                zoomLevel={zoomLevel}
              />
            )}

            {/* 우측 사이드바 */}
            {isRightSidebarOpen ? (
              <motion.div
                className="relative flex-shrink-0"
                style={{ width: rightSidebarWidth }}
              >
                {/* 우측 사이드바 리사이즈 핸들 */}
                <div
                  onMouseDown={handleRightResizeMouseDown}
                  onDoubleClick={handleRightResetWidth}
                  className="absolute left-0 top-0 w-1.5 h-full cursor-col-resize z-20 group"
                  title="Drag to resize, double-click to reset"
                >
                  <div className="w-full h-full transition-colors duration-200 group-hover:bg-blue-500/50" />
                </div>

                <EnhancedMemoSidebar 
                  isOpen={isRightSidebarOpen}
                  onClose={() => setIsRightSidebarOpen(false)}
                  mode={memoMode}
                  onModeChange={setMemoMode}
                  zoomLevel={zoomLevel}
                  onCursorChange={(p) => setCursorPosition({lineNumber: p.line, column: p.column})}
                />
              </motion.div>
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
      </div>

      {/* Status Bar */}
      <StatusBar />

      {/* Floating Components */}
      <AnimatePresence>
        {isSearchOpen && <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />}
      </AnimatePresence>
      
      <MonacoWorkspace 
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
      />
    </div>
  );
}