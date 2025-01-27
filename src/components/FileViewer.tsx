import React from "react";
import ExcelFileViewer from "./files-viewer/ExcelFileViewer";
import ImageFileViewer from "./files-viewer/ImageFileViewer";
import MsgFileViewer from "./files-viewer/MsgFileViewer";
import PdfFileViewer from "./files-viewer/PdfFileViewer";
import WordFileViewer from "./files-viewer/WordFileViewer";

interface FileViewerProps {
  file: File | null;
}

const FileViewer: React.FC<FileViewerProps> = ({ file }) => {
  return (
    <div>
      {file && file.type.startsWith("image/") && (
        <ImageFileViewer file={file} />
      )}
      {file && file.type === "application/pdf" && <PdfFileViewer file={file} />}
      {file &&
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && (
          <WordFileViewer file={file} />
        )}
      {file &&
        (file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          file.type === "application/vnd.ms-excel") && (
          <ExcelFileViewer file={file} />
        )}
      {file && file.type === "application/vnd.ms-outlook" && (
        <MsgFileViewer file={file} />
      )}
    </div>
  );
};

export default FileViewer;
