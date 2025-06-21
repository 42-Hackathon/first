export interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'image' | 'link' | 'file' | 'video';
  stage: 'review' | 'refine' | 'consolidate';
  tags: string[];
  folderId?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    url?: string;
    fileSize?: number;
    dimensions?: { width: number; height: number };
    author?: string;
    views?: number;
  };
}

export interface Folder {
  id: string;
  name: string;
  color: string;
  itemCount: number;
  createdAt: string;
  parentId?: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  count: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'editor' | 'viewer';
}