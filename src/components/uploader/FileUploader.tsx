import { UploadCloudIcon } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

const FileUploader: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const acceptedTypes = {
    "application/pdf": [],
    "image/png": [],
    "image/jpeg": [".jpeg", ".jpg"],
    "application/msword": [],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      [],
    "application/vnd.ms-excel": [],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
    "application/vnd.ms-outlook": [],
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: acceptedTypes,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileUpload(acceptedFiles[0]);
      } else {
        toast("Unsupported file type: " + acceptedFiles);
      }
    },
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-gray-300 border-dashed rounded-lg w-xl p-8 text-center cursor-pointer"
    >
      <input {...getInputProps()} />
      <div className="flex items-center justify-center mb-4 text-gray-400">
        <UploadCloudIcon size={60} />
      </div>
      <p className="text-lg font-medium text-gray-700">Upload a file or Drag & drop your file here</p>
      <p className="text-gray-500 text-sm font-medium">
      Supports PDF, DOCX, XLSX, and MSG files
      </p>
    </div>
  );
};

export default FileUploader;
