import LeftToolbar from "../toolbar/left/LeftToolbar";
import RightToolbar from "../toolbar/right/RightToolbar";
import CanvasPreview from "./CanvasPreview";
import PDFPageNavigation from "./PDFPageNavigation";

const EditorContainer = () => {
  return (
    <div className="w-full">
      <LeftToolbar />
      <RightToolbar />

      <main className="flex-grow p-6 overflow-auto">
        <CanvasPreview />
      </main>

      <PDFPageNavigation />
    </div>
  );
};

export default EditorContainer;
