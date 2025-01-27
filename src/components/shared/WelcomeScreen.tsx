import React from "react";

interface WelcomeScreenProps {
  onClose: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white p-8 py-12 rounded-lg shadow-2xl shadow-black/30 max-w-xl w-full flex flex-col gap-8">
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          Welcome
        </h1>
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          Pibicy Front-End Developer Challenge
        </h1>

        <button
          onClick={onClose}
          className="px-5 py-2 text-sm rounded-lg hover:bg-gray-200 transition cursor-pointer font-medium mt-auto"
        >
          Let's get started
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
