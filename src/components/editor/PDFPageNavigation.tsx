import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useCanvasStore } from "../../store/canvasStore";

const PDFPageNavigation = () => {
  const { currentPage, totalPages, setCurrentPage } = useCanvasStore();

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
        className="p-2 hover:bg-gray-200 rounded-full cursor-pointer disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        <ChevronLeftIcon />
      </button>
      <span className="text-[12px]">
        {currentPage} / {totalPages}
      </span>
      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className="p-2 hover:bg-gray-200 rounded-full cursor-pointer disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
};

export default PDFPageNavigation;
