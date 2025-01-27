import { fabric } from "fabric";
import { useEffect, useRef, useState } from "react";
import {
  FiCircle,
  FiSquare,
  FiType,
  FiDownload,
  FiTrash2,
  FiZoomIn,
  FiZoomOut,
} from "react-icons/fi";

interface ImageFileViewerProps {
  file: File;
}

const ImageFileViewer: React.FC<ImageFileViewerProps> = ({ file }) => {
  const canvasEl = useRef<HTMLCanvasElement | null>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("#000");
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        if (canvasEl.current) {
          const canvasWidth = 800;
          const canvasHeight = 600;

          const scale = Math.min(
            canvasWidth / img.width,
            canvasHeight / img.height,
            1
          );

          const scaledWidth = img.width * scale;
          const scaledHeight = img.height * scale;

          canvasEl.current.width = scaledWidth;
          canvasEl.current.height = scaledHeight;

          const canvas = new fabric.Canvas(canvasEl.current, {
            backgroundColor: "#f9f9f9",
          });
          setFabricCanvas(canvas);

          const fabricImg = new fabric.Image(img, {
            left: 0,
            top: 0,
            scaleX: scale,
            scaleY: scale,
            selectable: false,
          });
          canvas.add(fabricImg);
          canvas.sendToBack(fabricImg);
        }
      };
    };
    reader.readAsDataURL(file);
  }, [file]);

  const addTextBox = () => {
    if (fabricCanvas) {
      const text = new fabric.Textbox("Type here", {
        left: 50,
        top: 50,
        width: 150,
        fontSize: 18,
        fill: selectedColor,
      });
      fabricCanvas.add(text);
      fabricCanvas.setActiveObject(text);
    }
  };

  const addShape = (shape: "circle" | "square") => {
    if (fabricCanvas) {
      let newShape;
      switch (shape) {
        case "circle":
          newShape = new fabric.Circle({
            left: 50,
            top: 50,
            radius: 30,
            fill: selectedColor,
          });
          break;
        case "square":
          newShape = new fabric.Rect({
            left: 50,
            top: 50,
            width: 50,
            height: 50,
            fill: selectedColor,
          });
          break;
      }
      if (newShape) {
        fabricCanvas.add(newShape);
      }
    }
  };

  const deleteSelectedObject = () => {
    if (fabricCanvas) {
      const activeObject = fabricCanvas.getActiveObject();
      if (activeObject) {
        fabricCanvas.remove(activeObject);
      }
    }
  };

  const saveCanvas = () => {
    if (fabricCanvas) {
      const originalFormat = file.type === "image/jpeg" ? "jpeg" : "png";
      const dataURL = fabricCanvas.toDataURL({
        format: originalFormat,
        multiplier: 1,
      });

      const link = document.createElement("a");
      link.href = dataURL;
      link.download = `annotated-image.${originalFormat}`;
      link.click();
    }
  };

  const zoomCanvas = (factor: number) => {
    if (fabricCanvas) {
      const newZoom = zoomLevel + factor;
      if (newZoom >= 0.5 && newZoom <= 3) {
        fabricCanvas.setZoom(newZoom);
        setZoomLevel(newZoom);
      }
    }
  };

  return (
    <div className="w-full p-6 bg-gray-50 rounded-md shadow-lg">
      <h3 className="text-2xl mb-4 font-semibold text-gray-800">
        Advanced Image Editor
      </h3>

      <div className="flex flex-col items-center gap-4">
        <canvas
          ref={canvasEl}
          className="border shadow-md max-w-full rounded-md"
        />

        <div className="flex flex-wrap justify-center items-center gap-4 mt-6 bg-gray-100 p-4 rounded-lg shadow-inner">
          {/* Color Picker */}
          <label className="flex items-center gap-2">
            <span className="text-gray-700 font-medium">Color:</span>
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-10 h-10 border-0"
            />
          </label>

          {/* Toolbar Buttons */}
          <button
            onClick={addTextBox}
            className="p-3 bg-blue-500 text-white rounded-full shadow hover:bg-blue-600"
            title="Add Text"
          >
            <FiType size={20} />
          </button>
          <button
            onClick={() => addShape("circle")}
            className="p-3 bg-green-500 text-white rounded-full shadow hover:bg-green-600"
            title="Add Circle"
          >
            <FiCircle size={20} />
          </button>
          <button
            onClick={() => addShape("square")}
            className="p-3 bg-yellow-500 text-white rounded-full shadow hover:bg-yellow-600"
            title="Add Square"
          >
            <FiSquare size={20} />
          </button>
          <button
            onClick={deleteSelectedObject}
            className="p-3 bg-red-500 text-white rounded-full shadow hover:bg-red-600"
            title="Delete Selected"
          >
            <FiTrash2 size={20} />
          </button>
          <button
            onClick={() => zoomCanvas(0.1)}
            className="p-3 bg-gray-500 text-white rounded-full shadow hover:bg-gray-600"
            title="Zoom In"
          >
            <FiZoomIn size={20} />
          </button>
          <button
            onClick={() => zoomCanvas(-0.1)}
            className="p-3 bg-gray-500 text-white rounded-full shadow hover:bg-gray-600"
            title="Zoom Out"
          >
            <FiZoomOut size={20} />
          </button>
          <button
            onClick={saveCanvas}
            className="p-3 bg-gray-800 text-white rounded-full shadow hover:bg-gray-900"
            title="Save Image"
          >
            <FiDownload size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageFileViewer;
