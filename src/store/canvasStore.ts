import { create } from "zustand";
import { fabric } from "fabric";

export type Tool =
  | "select"
  | "rectangle"
  | "circle"
  | "textbox"
  | "draw"
  | "highlight"
  | "image"
  | "trash"
  | null;

interface CanvasStore {
  canvas: fabric.Canvas | null;
  setCanvas: (canvas: fabric.Canvas | null) => void;
  activeTool: Tool | null;
  setActiveTool: (tool: Tool | null) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  setTextHighlight: (color: string) => void;
  activeColor: string;
  setActiveColor: (activeColor: string) => void;
  setOpacity: (opacity: number) => void;
  totalPages: number;
  currentPage: number;
  setTotalPages: (total: number) => void;
  setCurrentPage: (page: number) => void;
}

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  canvas: null,
  activeTool: "select",
  selectedFile: null,
  activeColor: "#000000",
  currentPage: 1,
  totalPages: 1,
  setCanvas: (canvas) => set({ canvas }),
  setActiveTool: (tool) => set({ activeTool: tool }),
  setSelectedFile: (file) => set({ selectedFile: file }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setTotalPages: (total) => set({ totalPages: total }),
  setTextHighlight: (activeColor: string) => {
    const canvas = get().canvas;
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (activeObject && activeObject.type === "textbox") {
        // If it's a textbox, apply a background color to simulate highlighting
        activeObject.set({
          backgroundColor: activeColor, // Apply highlight color as background
        });
        canvas.renderAll();
      }
    }
  },
  setActiveColor: (color) => set({ activeColor: color }),
  setOpacity: (opacity) => {
    const canvas = get().canvas;
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        activeObject.set("opacity", opacity); // Apply opacity
        canvas.renderAll();
      }
    }
  },
}));
