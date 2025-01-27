import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";
import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import Toolbar from "./toolbar/Toolbar";
import { PDFDocument, rgb } from "pdf-lib";
import { saveAs } from "file-saver";

interface CanvasEditorProps {
  file: File;
}

const CanvasEditor: React.FC<CanvasEditorProps> = ({ file }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: 800,
    height: 600,
  });
  const [fileType, setFileType] = useState<string | null>(null);

  useEffect(() => {
    const fileType = file.type.split("/")[0];
    setFileType(fileType);

    if (canvasRef.current && fileType === "image") {
      const canvas = new fabric.Canvas(canvasRef.current);
      fabricCanvasRef.current = canvas;

      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const fabricImage = new fabric.Image(img, { left: 0, top: 0 });
        setCanvasDimensions({
          width: fabricImage.width || 800,
          height: fabricImage.height || 600,
        });
        canvas.setWidth(fabricImage.width || 800);
        canvas.setHeight(fabricImage.height || 600);
        canvas.add(fabricImage);
        canvas.renderAll();
      };

      return () => {
        canvas.dispose();
        fabricCanvasRef.current = null;
      };
    }
  }, [file]);

  const addShape = (shape: "rectangle" | "circle") => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    let object;
    if (shape === "rectangle") {
      object = new fabric.Rect({
        width: 100,
        height: 50,
        fill: "rgba(255, 0, 0, 0.5)",
        left: canvas.getWidth() / 2 - 50,
        top: canvas.getHeight() / 2 - 25,
      });
    } else if (shape === "circle") {
      object = new fabric.Circle({
        radius: 50,
        fill: "rgba(0, 0, 255, 0.5)",
        left: canvas.getWidth() / 2 - 50,
        top: canvas.getHeight() / 2 - 50,
      });
    }

    if (object) {
      canvas.add(object);
      canvas.renderAll();
    }
  };

  const addHighlight = (opacity: number) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const highlight = new fabric.Rect({
      width: 200,
      height: 100,
      fill: `rgba(255, 255, 0, ${opacity})`,
      left: 50,
      top: 50,
    });

    canvas.add(highlight);
    canvas.renderAll();
  };

  const addText = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const text = new fabric.Textbox("Insert text here", {
      left: 100,
      top: 100,
      width: 200,
      fontSize: 20,
      fill: "black",
    });

    canvas.add(text);
    canvas.renderAll();
  };

  const saveFile = async () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const fileType = file.type;

    try {
      if (fileType.startsWith("image/")) {
        const fileContent = canvas.toDataURL({ format: "png", multiplier: 1 });
        const blob = await fetch(fileContent).then((res) => res.blob());
        saveAs(blob, "edited-file.png");
      } else if (fileType === "application/pdf") {
        const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];

        firstPage.drawText("Added Text Here", {
          x: 50,
          y: 550,
          size: 30,
          color: rgb(0, 0, 0),
        });

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        saveAs(blob, "edited-file.pdf");
      } else {
        alert("Unsupported file type. Only images and PDFs are supported.");
      }
    } catch (error) {
      console.error("Error saving file:", error);
      alert("Failed to save the file. Please try again.");
    }
  };

  return (
    <div>
      {fileType === "image" ? (
        <div>
          <Toolbar
            onAddHighlight={() => addHighlight(0.5)}
            onAddShape={addShape}
            onAddText={addText}
          />
          <canvas
            width={canvasDimensions.width}
            height={canvasDimensions.height}
            ref={canvasRef}
            className="border"
          />
          <div className="flex items-center gap-2 mt-4">
            <button
              className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-sm cursor-pointer"
              onClick={saveFile}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <DocViewer
          documents={[
            {
              uri: URL.createObjectURL(file),
              fileType: file.type,
            },
          ]}
          pluginRenderers={DocViewerRenderers}
          style={{ width: "100%", height: "600px" }}
        />
      )}
    </div>
  );
};

export default CanvasEditor;
