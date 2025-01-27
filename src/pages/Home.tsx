import EditorContainer from "../components/editor/EditorContainer";
import FileUploader from "../components/uploader/FileUploader";
import { useCanvasStore } from "../store/canvasStore";

const Home = () => {
  const { selectedFile, setSelectedFile } = useCanvasStore();

  return (
    <div className="w-full h-dvh">
      {!selectedFile ? (
        <div className="w-full h-full flex items-center justify-center">
          <FileUploader onFileUpload={setSelectedFile} />
        </div>
      ) : (
        <div className="w-full min-h-screen bg-gray-200">
          <EditorContainer />
        </div>
      )}
    </div>
  );
};

export default Home;
