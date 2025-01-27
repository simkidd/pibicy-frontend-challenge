import React, { useEffect, useState } from "react";
import mammoth from "mammoth";

interface WordFileViewerProps {
  file: File;
}

const WordFileViewer: React.FC<WordFileViewerProps> = ({ file }) => {
  const [wordContent, setWordContent] = useState<string | null>(null);

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      mammoth
        .extractRawText({ arrayBuffer })
        .then((result) => setWordContent(result.value));
    };
    reader.readAsArrayBuffer(file);
  }, [file]);

  return (
    <div>
      <h3 className="text-xl mb-4">Word File (.docx)</h3>
      <pre>{wordContent}</pre>
    </div>
  );
};

export default WordFileViewer;
