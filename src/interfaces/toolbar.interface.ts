import { AnnotationType } from "./annotation.interface";

export interface ToolbarOption {
  label: string;
  icon: JSX.Element;
  type: AnnotationType;
}
