import React from "react";
import { saveAs } from "file-saver";

interface SaveFileProps {
  onSave: () => Blob;
}

const SaveFile: React.FC<SaveFileProps> = ({ onSave }) => {
  const handleSave = () => {
    const blob = onSave();
    saveAs(blob, "edited-file");
  };

  return (
    <button
      className="text-white bg-[#4f46e5] hover:bg-[#4338ca] px-4 py-2 rounded-sm cursor-pointer"
      onClick={handleSave}
    >
      Save File
    </button>
  );
};

export default SaveFile;
