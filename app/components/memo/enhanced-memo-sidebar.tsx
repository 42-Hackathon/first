import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Editor } from "@monaco-editor/react";
import { 
  Plus,
  Save,
  FileText,
  PanelRightClose,
  MessageCircle,
  Code,
  Type,
  Image,
  Link as LinkIcon,
  Download,
  Upload,
  Settings,
  Maximize2,
  Minimize2,
  Globe,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ContentItem } from "@/types/content";

interface EnhancedMemoSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'memo' | 'chat';
  onModeChange: (mode: 'memo' | 'chat') => void;
}

interface ContentPill {
  id: string;
  type: 'text' | 'image' | 'link';
  title: string;
  content: string;
  metadata?: {
    url?: string;
    domain?: string;
    favicon?: string;
  };
}

export function EnhancedMemoSidebar({ isOpen, onClose, mode, onModeChange }: EnhancedMemoSidebarProps) {
  const [editorContent, setEditorContent] = useState("# 새 메모\n\n여기에 내용을 작성하세요...");
  const [editorLanguage, setEditorLanguage] = useState("markdown");
  const [isEditorExpanded, setIsEditorExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [contentPills, setContentPills] = useState<ContentPill[]>([]);
  
  const editorRef = useRef<any>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Monaco Editor 설정
  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 13,
    lineHeight: 20,
    padding: { top: 16, bottom: 16 },
    scrollBeyondLastLine: false,
    wordWrap: 'on' as const,
    theme: 'vs-dark',
    automaticLayout: true,
    scrollbar: {
      vertical: 'auto',
      horizontal: 'auto'
    },
    overviewRulerLanes: 0,
    hideCursorInOverviewRuler: true,
    overviewRulerBorder: false,
    renderLineHighlight: 'none',
    selectionHighlight: false,
    occurrencesHighlight: false
  };

  // 메모 저장
  const saveMemo = () => {
    // 실제 구현에서는 로컬 스토리지나 데이터베이스에 저장
    console.log('Saving memo:', editorContent);
  };

  // 드래그 앤 드롭 처리
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!dropZoneRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    try {
      // ContentItem 드래그 처리
      const contentItemData = e.dataTransfer.getData('application/content-item');
      if (contentItemData) {
        const contentItem: ContentItem = JSON.parse(contentItemData);
        await handleContentItemDrop(contentItem);
        return;
      }

      // 텍스트 데이터 처리
      const textData = e.dataTransfer.getData('text/plain');
      
      // URL 처리
      if (textData && (textData.startsWith('http://') || textData.startsWith('https://'))) {
        await handleUrlDrop(textData);
        return;
      }

      // 일반 텍스트 처리
      if (textData) {
        addContentPill({
          id: Date.now().toString(),
          type: 'text',
          title: textData.slice(0, 30) + (textData.length > 30 ? '...' : ''),
          content: textData
        });
      }

      // 파일 처리
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        await handleFilesDrop(files);
      }
    } catch (error) {
      console.error('Drop handling failed:', error);
    }
  };

  // ContentItem 드롭 처리
  const handleContentItemDrop = async (item: ContentItem) => {
    const pill: ContentPill = {
      id: Date.now().toString(),
      type: item.type === 'link' ? 'link' : item.type === 'image' ? 'image' : 'text',
      title: item.title,
      content: item.content,
      metadata: item.type === 'link' ? {
        url: item.metadata?.url || item.content,
        domain: item.metadata?.url ? new URL(item.metadata.url).hostname : undefined
      } : undefined
    };

    addContentPill(pill);
  };

  // URL 드롭 처리
  const handleUrlDrop = async (url: string) => {
    try {
      const domain = new URL(url).hostname;
      const pill: ContentPill = {
        id: Date.now().toString(),
        type: 'link',
        title: `Link from ${domain}`,
        content: url,
        metadata: {
          url,
          domain,
          favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=16`
        }
      };
      
      addContentPill(pill);
    } catch (error) {
      // URL 파싱 실패시 일반 텍스트로 처리
      addContentPill({
        id: Date.now().toString(),
        type: 'text',
        title: url.slice(0, 30) + '...',
        content: url
      });
    }
  };

  // 파일 드롭 처리
  const handleFilesDrop = async (files: File[]) => {
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        const imageUrl = URL.createObjectURL(file);
        addContentPill({
          id: Date.now().toString(),
          type: 'image',
          title: file.name,
          content: imageUrl
        });
      } else {
        addContentPill({
          id: Date.now().toString(),
          type: 'text',
          title: file.name,
          content: `File: ${file.name} (${file.type})`
        });
      }
    }
  };

  // 콘텐츠 pill 추가
  const addContentPill = (pill: ContentPill) => {
    setContentPills(prev => [...prev, pill]);
  };

  // 콘텐츠 pill 제거
  const removeContentPill = (id: string) => {
    setContentPills(prev => prev.filter(pill => pill.id !== id));
  };

  // pill을 에디터에 삽입
  const insertPillIntoEditor = (pill: ContentPill) => {
    let insertText = "";

    switch (pill.type) {
      case 'text':
        insertText = `${pill.content}\n\n`;
        break;
      case 'link':
        insertText = `[${pill.title}](${pill.content})\n\n`;
        break;
      case 'image':
        insertText = `![${pill.title}](${pill.content})\n\n`;
        break;
    }

    if (editorRef.current) {
      const editor = editorRef.current;
      const position = editor.getPosition();
      const range = {
        startLineNumber: position.lineNumber,
        startColumn: position.column,
        endLineNumber: position.lineNumber,
        endColumn: position.column
      };
      
      editor.executeEdits('insert-content', [{
        range,
        text: insertText
      }]);
      
      editor.focus();
    } else {
      setEditorContent(prev => prev + insertText);
    }
  };

  // pill 아이콘 가져오기
  const getPillIcon = (type: string) => {
    switch (type) {
      case 'image': return Image;
      case 'link': return LinkIcon;
      default: return FileText;
    }
  };

  // pill 색상 가져오기
  const getPillColor = (type: string) => {
    switch (type) {
      case 'image': return 'from-blue-400 to-purple-600';
      case 'link': return 'from-green-400 to-blue-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 320 }}
          animate={{ x: 0 }}
          exit={{ x: 320 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-80 h-full border-l border-white/10 bg-white/[0.08] backdrop-blur-xl flex flex-col relative overflow-hidden"
          ref={dropZoneRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Enhanced Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
          <div className="absolute inset-0 backdrop-blur-3xl bg-white/[0.02]" />
          
          {/* Drag Overlay */}
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-blue-500/20 border-2 border-blue-400 border-dashed z-50 flex items-center justify-center"
            >
              <div className="text-white text-center">
                <div className="w-16 h-16 bg-blue-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-8 w-8" />
                </div>
                <p className="text-lg font-medium">콘텐츠를 여기에 드롭하세요</p>
                <p className="text-sm opacity-80">텍스트, 링크, 이미지, 파일 지원</p>
              </div>
            </motion.div>
          )}
          
          <div className="relative z-10 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-white/20">
              <div className="flex items-center gap-1">
                <Button
                  variant={mode === 'memo' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => onModeChange('memo')}
                  className="text-white h-6 px-2 text-xs backdrop-blur-xl"
                >
                  <FileText className="h-3 w-3 mr-1" />
                  메모
                </Button>
                <Button
                  variant={mode === 'chat' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => onModeChange('chat')}
                  className="text-white h-6 px-2 text-xs backdrop-blur-xl"
                >
                  <MessageCircle className="h-3 w-3 mr-1" />
                  AI
                </Button>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditorExpanded(!isEditorExpanded)}
                  className="text-white hover:bg-white/10 h-6 w-6"
                  title={isEditorExpanded ? "축소" : "확장"}
                >
                  {isEditorExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-white hover:bg-white/10 h-6 w-6"
                >
                  <PanelRightClose className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {mode === 'memo' ? (
              <div className="flex-1 flex flex-col">
                {/* Content Pills */}
                {contentPills.length > 0 && (
                  <div className="p-3 border-b border-white/10">
                    <div className="text-white/80 text-xs font-medium mb-2">수집된 콘텐츠</div>
                    <div className="flex flex-wrap gap-2">
                      {contentPills.map((pill) => {
                        const PillIcon = getPillIcon(pill.type);
                        return (
                          <motion.div
                            key={pill.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`group relative bg-gradient-to-r ${getPillColor(pill.type)} rounded-full px-3 py-1.5 cursor-pointer hover:scale-105 transition-all duration-200`}
                            onClick={() => insertPillIntoEditor(pill)}
                          >
                            <div className="flex items-center gap-2 text-white">
                              {pill.type === 'link' && pill.metadata?.favicon ? (
                                <img 
                                  src={pill.metadata.favicon} 
                                  alt="" 
                                  className="w-3 h-3"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <PillIcon className="h-3 w-3" />
                              )}
                              
                              <div className="flex flex-col min-w-0">
                                {pill.type === 'link' && pill.metadata?.domain && (
                                  <div className="text-[9px] opacity-80 leading-none">
                                    {pill.metadata.domain}
                                  </div>
                                )}
                                <div className="text-xs font-medium truncate max-w-32">
                                  {pill.title}
                                </div>
                              </div>
                            </div>
                            
                            {/* Remove button */}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeContentPill(pill.id);
                              }}
                              className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-2 w-2 text-white" />
                            </Button>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Editor Controls */}
                <div className="flex items-center justify-between p-2 border-b border-white/10">
                  <div className="flex items-center gap-1">
                    <select
                      value={editorLanguage}
                      onChange={(e) => setEditorLanguage(e.target.value)}
                      className="bg-white/10 border border-white/20 rounded px-2 py-1 text-xs text-white"
                    >
                      <option value="markdown">Markdown</option>
                      <option value="javascript">JavaScript</option>
                      <option value="typescript">TypeScript</option>
                      <option value="json">JSON</option>
                      <option value="plaintext">Plain Text</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={saveMemo}
                      className="text-white hover:bg-white/10 h-6 w-6"
                      title="저장"
                    >
                      <Save className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Monaco Editor */}
                <div className="flex-1">
                  <Editor
                    height="100%"
                    language={editorLanguage}
                    value={editorContent}
                    onChange={(value) => setEditorContent(value || "")}
                    onMount={(editor) => {
                      editorRef.current = editor;
                    }}
                    options={editorOptions}
                    theme="vs-dark"
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-white/60">
                <div className="text-center">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">AI 채팅 기능</p>
                  <p className="text-[10px] mt-1">곧 구현될 예정입니다</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}