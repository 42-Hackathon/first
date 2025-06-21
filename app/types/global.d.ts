export {};

declare global {
  interface Window {
    electronAPI?: {
      showStickyNote: () => void;
      // Add other Electron APIs here as needed
    };
  }
} 