import { SaveIcon } from "lucide-react";

const RightToolbar = () => {

  return (
    <aside className="fixed z-50 right-8 top-1/2 -translate-y-1/2 flex flex-col items-center space-y-3 bg-white p-4  w-28 shadow rounded-4xl">
      <div className="flex flex-col">
        <button className="p-2 hover:bg-gray-200 rounded-full cursor-pointer disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed">
          <SaveIcon />
        </button>
      </div>
    </aside>
  );
};

export default RightToolbar;
