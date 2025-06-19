import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Grid3X3, 
  List, 
  LayoutGrid,
  Columns,
  MoreHorizontal,
  Star,
  Share2,
  Eye,
  Calendar,
  Edit3,
  GripVertical
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ContentItem } from "@/types/content";

interface DraggableContentGridProps {
  items: ContentItem[];
  viewMode: 'masonry' | 'grid' | 'list' | 'justified';
  onViewModeChange: (mode: 'masonry' | 'grid' | 'list' | 'justified') => void;
  onItemSelect: (item: ContentItem) => void;
  selectedItems: string[];
  folderName?: string;
}

export function DraggableContentGrid({ 
  items, 
  viewMode, 
  onViewModeChange, 
  onItemSelect, 
  selectedItems,
  folderName = "모든 콘텐츠"
}: DraggableContentGridProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editorContent, setEditorContent] = useState("");

  const getGridClassName = () => {
    switch (viewMode) {
      case 'masonry':
        return 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-3';
      case 'grid':
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3';
      case 'justified':
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3';
      case 'list':
        return 'flex flex-col gap-1.5';
      default:
        return 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-3';
    }
  };

  const handleDragStart = (e: React.DragEvent, item: ContentItem) => {
    setDraggedItem(item.id);
    
    // ContentItem 데이터를 드래그 데이터로 설정
    e.dataTransfer.setData('application/content-item', JSON.stringify(item));
    e.dataTransfer.setData('text/plain', item.content);
    
    // 드래그 이미지 설정
    e.dataTransfer.effectAllowed = 'copy';
    
    // 드래그 중 투명도 효과
    setTimeout(() => {
      const draggedElement = e.target as HTMLElement;
      if (draggedElement) {
        draggedElement.style.opacity = '0.5';
      }
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedItem(null);
    const draggedElement = e.target as HTMLElement;
    if (draggedElement) {
      draggedElement.style.opacity = '1';
    }
  };

  const getContentPreview = (item: ContentItem) => {
    const baseClasses = viewMode === 'list' ? 'w-12 h-12' : 'w-full h-36';
    
    switch (item.type) {
      case 'image':
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-blue-400 to-purple-600 rounded-md mb-2 flex items-center justify-center relative overflow-hidden`}>
            <span className="text-white text-xs">이미지</span>
            <div className="absolute inset-0 bg-black/20" />
          </div>
        );
      case 'link':
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-green-400 to-blue-600 rounded-md mb-2 flex items-center justify-center relative overflow-hidden`}>
            <div className="text-center text-white">
              <div className="text-xs font-medium">🔗</div>
              <div className="text-[10px] opacity-80">
                {item.metadata?.url ? new URL(item.metadata.url).hostname : 'Link'}
              </div>
            </div>
            <div className="absolute inset-0 bg-black/20" />
          </div>
        );
      case 'video':
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-red-400 to-pink-600 rounded-md mb-2 flex items-center justify-center relative overflow-hidden`}>
            <span className="text-white text-xs">동영상</span>
            <div className="absolute inset-0 bg-black/20" />
          </div>
        );
      default:
        return (
          <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
            <p className="text-white/90 text-xs line-clamp-3 mb-2">
              {item.content}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-white">{folderName}</h1>
          <Badge variant="secondary" className="bg-white/20 text-white text-xs">
            {items.length}개 항목
          </Badge>
        </div>
        
        <div className="flex items-center gap-1">
          {/* View Mode Buttons */}
          <Button
            variant={viewMode === 'masonry' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => onViewModeChange('masonry')}
            className="text-white hover:bg-white/10 h-7 w-7"
            title="폭포수 보기"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant={viewMode === 'justified' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => onViewModeChange('justified')}
            className="text-white hover:bg-white/10 h-7 w-7"
            title="양쪽 정렬"
          >
            <Columns className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => onViewModeChange('grid')}
            className="text-white hover:bg-white/10 h-7 w-7"
            title="그리드 보기"
          >
            <Grid3X3 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => onViewModeChange('list')}
            className="text-white hover:bg-white/10 h-7 w-7"
            title="목록 보기"
          >
            <List className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="flex-1 flex">
        <div className="flex-1 p-4">
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-white/60"
            >
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-3">
                <Edit3 className="h-6 w-6" />
              </div>
              <p className="text-base mb-1">새로운 아이디어를 시작해보세요</p>
              <p className="text-xs">여기에 바로 작성하거나 콘텐츠를 수집해보세요</p>
              
              {/* Inline Editor */}
              <div className="mt-6 w-full max-w-2xl">
                <Textarea
                  placeholder="여기에 바로 작성을 시작하세요... (Obsidian, Notion처럼)"
                  value={editorContent}
                  onChange={(e) => setEditorContent(e.target.value)}
                  className="min-h-[200px] bg-white/5 border-white/20 text-white placeholder:text-white/50 resize-none"
                  onFocus={() => setIsEditing(true)}
                />
                {isEditing && (
                  <div className="flex justify-end gap-2 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsEditing(false);
                        setEditorContent("");
                      }}
                      className="text-white/70 hover:bg-white/10 h-7 px-3 text-xs"
                    >
                      취소
                    </Button>
                    <Button
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 text-white h-7 px-3 text-xs"
                    >
                      저장
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <div className={getGridClassName()}>
              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.03 }}
                    className={viewMode === 'masonry' ? 'break-inside-avoid mb-3' : ''}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                    onDragEnd={handleDragEnd}
                  >
                    <GlassCard 
                      className={`p-3 cursor-pointer transition-all duration-200 hover:bg-white/20 hover:scale-[1.01] relative group ${
                        selectedItems.includes(item.id) ? 'ring-1 ring-blue-400 bg-white/10' : ''
                      } ${viewMode === 'list' ? 'flex items-center gap-3' : ''} ${
                        draggedItem === item.id ? 'opacity-50' : ''
                      }`}
                      onClick={() => onItemSelect(item)}
                    >
                      {/* Drag Handle */}
                      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                        <GripVertical className="h-3 w-3 text-white/50" />
                      </div>

                      {/* Content Preview */}
                      {getContentPreview(item)}

                      {/* Item Info */}
                      <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
                        <div className="flex items-start justify-between mb-1.5">
                          <h3 className="text-white font-medium text-xs line-clamp-2 flex-1 pl-6">
                            {item.title}
                          </h3>
                          
                          <AnimatePresence>
                            {hoveredItem === item.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex items-center gap-0.5 ml-2"
                              >
                                <Button variant="ghost" size="icon" className="h-5 w-5 text-white/70 hover:bg-white/10">
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-5 w-5 text-white/70 hover:bg-white/10">
                                  <Star className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-5 w-5 text-white/70 hover:bg-white/10">
                                  <Share2 className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-5 w-5 text-white/70 hover:bg-white/10">
                                  <MoreHorizontal className="h-3 w-3" />
                                </Button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        
                        <div className="flex items-center justify-between pl-6">
                          <div className="flex items-center gap-1 flex-wrap">
                            <Badge 
                              variant="secondary" 
                              className="bg-white/20 text-white text-[10px] px-1.5 py-0 h-4"
                            >
                              {item.stage}
                            </Badge>
                            {item.tags.slice(0, 2).map(tag => (
                              <Badge 
                                key={tag}
                                variant="outline" 
                                className="border-white/30 text-white/70 text-[10px] px-1.5 py-0 h-4"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-1 text-white/50 text-[10px]">
                            <Calendar className="h-2.5 w-2.5" />
                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}