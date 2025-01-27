import React, { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
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
    const detectedFileType = file.type.split("/")[0];
    setFileType(detectedFileType);

    if (canvasRef.current) {
      const canvas = new fabric.Canvas(canvasRef.current);
      fabricCanvasRef.current = canvas;

      if (detectedFileType === "image") {
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
      } else if (detectedFileType === "application") {
        // Handle PDFs or other application files
      }

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
        left: 50,
        top: 50,
      });
    } else if (shape === "circle") {
      object = new fabric.Circle({
        radius: 50,
        fill: "rgba(0, 0, 255, 0.5)",
        left: 100,
        top: 100,
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

    try {
      if (fileType === "image") {
        // Handle image files
        const fileContent = canvas.toDataURL({
          format: "png",
          multiplier: 1,
        });
        const blob = await fetch(fileContent).then((res) => res.blob());
        saveAs(blob, "edited-file.png");
      } else if (file.type === "application/pdf") {
        // Handle PDF files
        const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];

        // Example: Adding annotations or text
        firstPage.drawText("Added Text Here", {
          x: 50,
          y: firstPage.getHeight() - 50, // Adjust to PDF coordinate system
          size: 30,
          color: rgb(0, 0, 0),
        });

        // Save the updated PDF
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
  );
};

export default CanvasEditor;
