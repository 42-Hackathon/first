export type ContentItem = 
  | {
      id: string;
      title: string;
      content: string;
      type: 'text';
      stage: 'review' | 'refine' | 'consolidate';
      tags: string[];
      folderId?: string;
      createdAt: string;
      updatedAt: string;
      metadata?: Record<string, never>;
    }
  | {
      id: string;
      title: string;
      content: string;
      type: 'image';
      stage: 'review' | 'refine' | 'consolidate';
      tags: string[];
      folderId?: string;
      createdAt: string;
      updatedAt: string;
      metadata: {
        imageUrl: string;
        fileSize?: number;
        dimensions?: { width: number; height: number };
      };
    }
  | {
      id: string;
      title: string;
      content: string;
      type: 'link';
      stage: 'review' | 'refine' | 'consolidate';
      tags: string[];
      folderId?: string;
      createdAt: string;
      updatedAt: string;
      metadata: {
        url: string;
        hostname?: string;
      };
    }
  | {
  id: string;
  title: string;
  content: string;
      type: 'file' | 'video';
  stage: 'review' | 'refine' | 'consolidate';
  tags: string[];
  folderId?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    url?: string;
    fileSize?: number;
      };
  };

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