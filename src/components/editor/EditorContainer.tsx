import Toolbar from "../toolbar/Toolbar";
import CanvasPreview from "./CanvasPreview";

const EditorContainer = () => {
  return (
    <div className="w-full">
      <Toolbar />

      <main className="flex-grow p-6 overflow-auto">
        <CanvasPreview />
      </main>
    </div>
  );
};

export default EditorContainer;
