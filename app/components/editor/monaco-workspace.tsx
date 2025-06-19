import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Save, 
  Download, 
  Upload,
  FileText,
  Code,
  Settings
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MonacoWorkspaceProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MonacoWorkspace({ isOpen, onClose }: MonacoWorkspaceProps) {
  const [activeTab, setActiveTab] = useState("editor");
  const [content, setContent] = useState("// Welcome to the Monaco Editor\n// Start typing your code here...\n\nfunction hello() {\n  console.log('Hello, World!');\n}");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Editor Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-4 z-50"
          >
            <GlassCard className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/20">
                <div className="flex items-center gap-3">
                  <Code className="h-5 w-5 text-white" />
                  <h2 className="text-white font-medium">Code Editor</h2>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10"
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10"
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="text-white hover:bg-white/10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-4">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
                  <TabsList className="bg-white/10 border-white/20">
                    <TabsTrigger value="editor" className="text-white data-[state=active]:bg-white/20">
                      <FileText className="h-4 w-4 mr-2" />
                      Editor
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="text-white data-[state=active]:bg-white/20">
                      <Code className="h-4 w-4 mr-2" />
                      Preview
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="text-white data-[state=active]:bg-white/20">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="editor" className="h-full mt-4">
                    <div className="h-full bg-gray-900 rounded-lg p-4 font-mono text-sm text-white overflow-auto">
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full h-full bg-transparent border-none outline-none resize-none text-white"
                        placeholder="Start coding..."
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="preview" className="h-full mt-4">
                    <div className="h-full bg-white/5 rounded-lg p-4 text-white">
                      <h3 className="text-lg font-medium mb-4">Preview</h3>
                      <pre className="text-sm text-white/80 whitespace-pre-wrap">
                        {content}
                      </pre>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="settings" className="h-full mt-4">
                    <div className="h-full bg-white/5 rounded-lg p-4 text-white">
                      <h3 className="text-lg font-medium mb-4">Editor Settings</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm text-white/80">Theme</label>
                          <select className="w-full mt-1 bg-white/10 border border-white/20 rounded px-3 py-2 text-white">
                            <option value="dark">Dark</option>
                            <option value="light">Light</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm text-white/80">Font Size</label>
                          <select className="w-full mt-1 bg-white/10 border border-white/20 rounded px-3 py-2 text-white">
                            <option value="12">12px</option>
                            <option value="14">14px</option>
                            <option value="16">16px</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </GlassCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}