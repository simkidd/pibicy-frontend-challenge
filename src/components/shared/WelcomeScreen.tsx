import React from "react";

interface WelcomeScreenProps {
  onClose: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-100 flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">
        Pibicy Front-End Developer Challenge
      </h1>
      <p className="text-gray-600 text-base mb-6">
        Explore the completed{" "}
        <strong>Pibicy Front-End Developer Challenge</strong>. This application
        demonstrates clean design, responsiveness, and functionality.
      </p>
      <button
        onClick={onClose}
        className="px-5 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 transition"
      >
        Let's get started
      </button>
    </div>
  );
};

export default WelcomeScreen;
