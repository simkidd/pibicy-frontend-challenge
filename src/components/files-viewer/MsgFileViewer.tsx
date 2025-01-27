import React, { useEffect, useState } from "react";
import MsgReader from "@kenjiuno/msgreader";

interface MsgFileViewerProps {
  file: File;
}

const MsgFileViewer: React.FC<MsgFileViewerProps> = ({ file }) => {
  const [msgSubject, setMsgSubject] = useState<string | null>(null);
  const [msgBody, setMsgBody] = useState<string | null>(null);

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const msgReader = new MsgReader(e.target?.result as ArrayBuffer);
      const msg = msgReader.getFileData();
      setMsgSubject(msg.subject as string);
      setMsgBody(msg.body as string);
    };
    reader.readAsBinaryString(file);
  }, [file]);

  return (
    <div>
      <h3 className="text-xl mb-4">Outlook (.msg) File</h3>
      <p>
        <strong>Subject:</strong> {msgSubject}
      </p>
      <p>
        <strong>Body:</strong> {msgBody}
      </p>
    </div>
  );
};

export default MsgFileViewer;
