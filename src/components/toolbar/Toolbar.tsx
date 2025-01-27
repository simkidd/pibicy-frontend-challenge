import { fabric } from "fabric";
import {
  CircleIcon,
  Edit2Icon,
  HighlighterIcon,
  ImageUpIcon,
  MousePointerIcon,
  SquareIcon,
  TrashIcon,
  TypeIcon,
} from "lucide-react";
import { useRef, useState } from "react";
import { ChromePicker } from "react-color";
import { toast } from "sonner";
import { useCanvasStore } from "../../store/canvasStore";

const Toolbar = () => {
  const { activeTool, setActiveTool, setActiveColor, activeColor, canvas } =
    useCanvasStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showColorPalette, setShowColorPalette] = useState(false);

  const handleDelete = () => {
    if (!canvas) return;
    const activeObjects = canvas.getActiveObjects();
    activeObjects.forEach((obj) => canvas.remove(obj));
    canvas.discardActiveObject();
    canvas.renderAll();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !canvas) {
      console.log("No file selected or canvas not initialized.");
      return;
    }

    console.log("Starting image upload...");

    const reader = new FileReader();
    reader.onload = (e) => {
      console.log("File reading completed. Processing image...");
      const imgData = e.target?.result as string;

      fabric.Image.fromURL(imgData, (img) => {
        if (img) {
          console.log("Image loaded successfully. Adding to canvas...");
          img.scaleToWidth(200); // Scale the image to desired width
          canvas.add(img); // Add the image to the canvas
          canvas.renderAll(); // Re-render the canvas
          toast.success("Image added successfully!");
        } else {
          console.error("Failed to load image.");
          toast.error("Failed to load image.");
        }
      });
    };

    reader.onerror = () => {
      console.error("Error reading the file.");
      toast.error("Error reading the file.");
    };

    reader.readAsDataURL(file);
  };

  // Open the file input when the image tool button is clicked
  const handleImageButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the hidden file input click
    }
  };

  return (
    <aside className="fixed z-50 left-8 top-1/2 -translate-y-1/2 flex flex-col items-center space-y-3 bg-white p-4  w-16 shadow rounded-4xl">
      <button
        className={`p-2 hover:bg-gray-200 rounded-full cursor-pointer ${
          activeTool === "select" ? "bg-gray-300" : ""
        }`}
        title="Select"
        onClick={() => setActiveTool("select")}
      >
        <MousePointerIcon size={20} />
      </button>
      <button
        className="p-2 hover:bg-gray-200 rounded-full cursor-pointer"
        title="Add Rectangle"
        onClick={() => setActiveTool("rectangle")}
      >
        <SquareIcon size={20} />
      </button>
      <button
        className="p-2 hover:bg-gray-200 rounded-full cursor-pointer"
        title="Add Circle"
        onClick={() => setActiveTool("circle")}
      >
        <CircleIcon size={20} />
      </button>
      <button
        className={`p-2 hover:bg-gray-200 rounded-full cursor-pointer ${
          activeTool === "textbox" ? "bg-gray-300" : ""
        }`}
        title="Textbox"
        onClick={() => setActiveTool("textbox")}
      >
        <TypeIcon size={20} />
      </button>
      <button
        className={`p-2 hover:bg-gray-200 rounded-full cursor-pointer ${
          activeTool === "draw" ? "bg-gray-300" : ""
        }`}
        title="Draw"
        onClick={() => setActiveTool("draw")}
      >
        <Edit2Icon size={20} />
      </button>
      <button
        className={`p-2 hover:bg-gray-200 rounded-full cursor-pointer ${
          activeTool === "highlight" ? "bg-gray-300" : ""
        }`}
        title="Highlighter"
        onClick={() => setActiveTool("highlight")}
      >
        <HighlighterIcon size={20} />
      </button>

      <button
        className="p-2 hover:bg-gray-200 rounded-full cursor-pointer"
        title="Delete selected"
        onClick={handleDelete}
      >
        <TrashIcon size={20} />
      </button>

      <div>
        <button
          className="p-2 hover:bg-gray-200 rounded-full cursor-pointer"
          title="Image"
          onClick={handleImageButtonClick}
        >
          <ImageUpIcon size={20} />
        </button>
        {/* Hidden file input for image upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>

      <div className="relative">
        <button
          className="size-5 flex hover:bg-gray-200 rounded-sm cursor-pointer"
          style={{ backgroundColor: activeColor }}
          title="Pick a color"
          onClick={() => setShowColorPalette(!showColorPalette)}
        >
          <span className="sr-only">Pick a color</span>
        </button>
        {showColorPalette && (
          <ChromePicker
            className="absolute bottom-1/2 left-full"
            color={activeColor}
            onChange={(color) => setActiveColor(color.hex)}
          />
        )}
      </div>
    </aside>
  );
};

export default Toolbar;
