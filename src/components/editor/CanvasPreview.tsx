/* eslint-disable @typescript-eslint/no-explicit-any */
import { fabric } from "fabric";
import { useEffect, useRef } from "react";
import { useCanvasStore } from "../../store/canvasStore";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

const CanvasPreview = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    canvas,
    setCanvas,
    activeTool,
    activeColor,
    selectedFile,
    currentPage,
    setTotalPages,
  } = useCanvasStore();

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize the fabric canvas
    const canvasInstance = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#fff", // Optional: Set default background color
    });

    // Set canvas reference in the store
    setCanvas(canvasInstance);

    return () => {
      // Cleanup fabric canvas instance on component unmount
      canvasInstance.dispose();
      setCanvas(null);
    };
  }, [setCanvas]);

  // Configure pdf.js worker
  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;
  }, []);

  const resizeCanvas = (width: number, height: number) => {
    if (canvas) {
      canvas.setWidth(width);
      canvas.setHeight(height);
      canvas.renderAll();
    }
  };

  const handlePDFFile = async (file: File) => {
    try {
      const fileUrl = URL.createObjectURL(file);
      const pdf = await pdfjs.getDocument(fileUrl).promise;
      setTotalPages(pdf.numPages);
      const page = await pdf.getPage(currentPage);
      const viewport = page.getViewport({ scale: 1.5 });

      // Resize canvas to fit the PDF page
      resizeCanvas(viewport.width, viewport.height);

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = viewport.width;
      tempCanvas.height = viewport.height;

      await page.render({
        canvasContext: tempCanvas.getContext("2d")!,
        viewport: viewport,
      }).promise;

      if (!canvas) return;

      fabric.Image.fromURL(tempCanvas.toDataURL(), (img) => {
        canvas.clear();
        canvas.add(img);
        canvas.renderAll();
        toast.success("PDF loaded successfully!");
      });
    } catch (error: any) {
      toast.error("Error loading PDF file:", error);
    }
  };

  // Re-render PDF when page changes
  useEffect(() => {
    if (selectedFile?.type === "application/pdf") {
      handlePDFFile(selectedFile);
    }
  }, [currentPage, selectedFile]);

  const handleExcelFile = async (file: File) => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

        const canvasWidth = 800;
        const canvasHeight = 50 + jsonData.length * 30; // Adjust height based on row count
        resizeCanvas(canvasWidth, canvasHeight);

        if (!canvas) return;

        canvas.clear();
        let yOffset = 50;

        jsonData.forEach((row: any) => {
          let xOffset = 50;
          row.forEach((cell: any) => {
            const text = new fabric.IText(cell.toString(), {
              left: xOffset,
              top: yOffset,
              fontSize: 14,
              fill: "#333333",
            });
            canvas.add(text);
            xOffset += 150;
          });
          yOffset += 30;
        });

        canvas.renderAll();
        toast.success("Excel file loaded successfully!");
      };
      reader.readAsArrayBuffer(file);
    } catch (error: any) {
      toast.error("Error loading Excel file:", error);
    }
  };

  const handleDocxFile = (file: File) => {
    if (!canvas) return;

    const canvasWidth = 800;
    const canvasHeight = 600; // Adjust this based on DOCX content if needed
    resizeCanvas(canvasWidth, canvasHeight);

    const text = new fabric.IText(`Document: ${file.name}`, {
      left: 100,
      top: 100,
      fontSize: 20,
      fill: "#333333",
    });

    canvas.clear();
    canvas.add(text);
    canvas.renderAll();
    toast.success("Document loaded successfully!");
  };

  const handleMsgFile = (file: File) => {
    if (!canvas) return;

    const canvasWidth = 800;
    const canvasHeight = 600; // Adjust this based on email content if needed
    resizeCanvas(canvasWidth, canvasHeight);

    const text = new fabric.IText(`Email: ${file.name}`, {
      left: 100,
      top: 100,
      fontSize: 20,
      fill: "#333333",
    });

    canvas.clear();
    canvas.add(text);
    canvas.renderAll();
    toast.success("Email loaded successfully!");
  };

  useEffect(() => {
    if (!canvas || !selectedFile) return;

    switch (selectedFile.type) {
      case "application/pdf":
        handlePDFFile(selectedFile);
        break;
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        handleExcelFile(selectedFile);
        break;
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        handleDocxFile(selectedFile);
        break;
      case "application/vnd.ms-outlook":
        handleMsgFile(selectedFile);
        break;
      default:
        toast.error("Unsupported file type");
    }
  }, [selectedFile, canvas]);

  useEffect(() => {
    // Handle active tools
    if (!canvas) return;

    // Reset drawing mode whenever the active tool changes
    canvas.isDrawingMode = false;

    let tool: fabric.Object | null = null;

    switch (activeTool) {
      case "rectangle":
        tool = new fabric.Rect({
          left: 100,
          top: 100,
          fill: activeColor,
          width: 100,
          height: 100,
        });
        break;

      case "circle":
        tool = new fabric.Circle({
          left: 150,
          top: 150,
          fill: activeColor,
          radius: 50,
        });
        break;

      case "textbox":
        tool = new fabric.Textbox("Type here", {
          left: 200,
          top: 200,
          fontSize: 18,
          width: 200,
          fill: activeColor,
        });
        break;

      case "draw":
        canvas.isDrawingMode = true;

        if (canvas.isDrawingMode) {
          if (!canvas.freeDrawingBrush) {
            // Initialize the brush if it doesn't exist
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
          }

          // Use the color from the store for drawing
          canvas.freeDrawingBrush.color = activeColor;
          canvas.freeDrawingBrush.width = 3; // Set pen width
          canvas.freeDrawingBrush.strokeLineCap = "round"; // Set stroke line cap
        }
        break;

      case "highlight":
        // Set highlighting with selected color
        canvas.isDrawingMode = true;
        if (!canvas.freeDrawingBrush) {
          // Initialize the brush if it doesn't exist
          canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        }
        canvas.freeDrawingBrush.color = "#ffff0080";
        canvas.freeDrawingBrush.width = 15; // Set higher width for highlight
        canvas.freeDrawingBrush.strokeLineCap = "square"; // Set stroke line cap
        break;

      default:
        break;
    }

    if (tool) {
      canvas.add(tool);
      canvas.setActiveObject(tool);
      canvas.renderAll();
    }
  }, [canvas, activeTool, activeColor]); // Adding color as a dependency here

  return (
    <div className="relative w-full h-full flex justify-center">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default CanvasPreview;
