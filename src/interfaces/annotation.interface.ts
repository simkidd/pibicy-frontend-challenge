export type AnnotationType =
  | "text"
  | "line"
  | "circle"
  | "highlight"
  | "opaqueHighlight";

export interface Annotation {
  id: string;
  type: AnnotationType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  color?: string;
  content?: string;
}
