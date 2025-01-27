export interface UploadedFile {
  name: string;
  type: string;
  size: number;
  content?: ArrayBuffer | string;
}

export type SupportedFileType =
  | "pdf"
  | "doc"
  | "xls"
  | "xlsx"
  | "jpg"
  | "png"
  | "msg";
