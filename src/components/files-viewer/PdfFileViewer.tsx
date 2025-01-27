import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

interface Highlight {
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PdfFileViewerProps {
  file: File;
}

const PdfFileViewer: React.FC<PdfFileViewerProps> = ({ file }) => {
  const [pdfFileUrl, setPdfFileUrl] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [selectionRange, setSelectionRange] = useState<DOMRect | null>(null);

  // Undo/Redo stacks
  const [undoStack, setUndoStack] = useState<Highlight[][]>([]);
  const [redoStack, setRedoStack] = useState<Highlight[][]>([]);

  // Configure pdf.js worker
  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;
  }, []);

  useEffect(() => {
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setPdfFileUrl(fileUrl); // Store the PDF URL
    }
  }, [file]);

  const onLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelectionRange(rect); // Store the selection's bounding box
    }
  };

  const highlightSelectedText = () => {
    if (selectionRange) {
      const highlight = {
        page: pageNumber,
        x: selectionRange.left,
        y: selectionRange.top,
        width: selectionRange.width,
        height: selectionRange.height,
      };

      // Save the current highlights in the undo stack before making any changes
      setUndoStack((prevStack) => [...prevStack, highlights]);
      setHighlights((prev) => [...prev, highlight]);
      setSelectionRange(null); // Clear the selection range
      setRedoStack([]); // Clear redo stack when new action is performed
    }
  };

  const undoHighlight = () => {
    if (undoStack.length > 0) {
      const previousHighlights = undoStack[undoStack.length - 1];
      setRedoStack((prevStack) => [...prevStack, highlights]); // Save current highlights to redo stack
      setHighlights(previousHighlights); // Restore previous highlights
      setUndoStack(undoStack.slice(0, -1)); // Remove the last state from undo stack
    }
  };

  const redoHighlight = () => {
    if (redoStack.length > 0) {
      const nextHighlights = redoStack[redoStack.length - 1];
      setUndoStack((prevStack) => [...prevStack, highlights]); // Save current highlights to undo stack
      setHighlights(nextHighlights); // Restore next highlights from redo stack
      setRedoStack(redoStack.slice(0, -1)); // Remove the last state from redo stack
    }
  };

  return (
    <div>
      <h3 className="text-xl mb-4">PDF File</h3>
      <div className="toolbar mb-4">
        <button onClick={highlightSelectedText} disabled={!selectionRange}>
          Highlight Text
        </button>
        <button onClick={undoHighlight} disabled={undoStack.length === 0}>
          Undo
        </button>
        <button onClick={redoHighlight} disabled={redoStack.length === 0}>
          Redo
        </button>
      </div>
      {pdfFileUrl ? (
        <div>
          <div
            onMouseUp={handleTextSelection}
            style={{ position: "relative", cursor: "text" }}
          >
            <Document file={pdfFileUrl} onLoadSuccess={onLoadSuccess}>
              <Page pageNumber={pageNumber} />
            </Document>

            {/* Render highlights */}
            {highlights
              .filter((hl) => hl.page === pageNumber)
              .map((highlight, index) => (
                <div
                  key={index}
                  style={{
                    position: "absolute",
                    left: highlight.x,
                    top: highlight.y,
                    width: highlight.width,
                    height: highlight.height,
                    backgroundColor: "rgba(255, 255, 0, 0.4)", // Yellow transparent highlight
                    pointerEvents: "none", // Allow interaction below the highlight
                  }}
                ></div>
              ))}
          </div>
          <div className="mt-4 flex justify-around">
            <button
              disabled={pageNumber <= 1}
              onClick={() => setPageNumber(pageNumber - 1)}
            >
              Previous
            </button>
            <span>
              Page {pageNumber} of {numPages}
            </span>
            <button
              disabled={pageNumber >= numPages}
              onClick={() => setPageNumber(pageNumber + 1)}
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <p>Loading PDF...</p>
      )}
    </div>
  );
};

export default PdfFileViewer;
