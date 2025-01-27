import { useCanvasStore } from "../../store/canvasStore";
import PDFPageNavigation from "../editor/PDFPageNavigation";

const Header = () => {
  const { selectedFile } = useCanvasStore();

  return (
    <div className="bg-transparent h-[68px] flex justify-between items-center  gap-x-8 fixed top-0 left-0 z-[60] w-full">
      <div className="text-2xl font-bold shrink-0 bg-white h-full flex items-center px-4">
        FileEdit
      </div>

      {selectedFile && (
        <div className="h-full px-4 bg-white flex items-center">
          <PDFPageNavigation />
        </div>
      )}
    </div>
  );
};

export default Header;
