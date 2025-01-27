import { useState } from "react";
import { Toaster } from "sonner";
import Header from "./components/shared/Header";
import WelcomeScreen from "./components/shared/WelcomeScreen";
import Home from "./pages/Home";

const App = () => {
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);

  const closeWelcomeScreen = () => {
    setShowWelcomeScreen(false);
  };

  return (
    <div className="w-full min-h-screen bg-white relative">
      <Toaster position="top-center" />
      {showWelcomeScreen && <WelcomeScreen onClose={closeWelcomeScreen} />}
      <Header />
      <main className="flex h-full w-full">
        <div className="relative flex flex-1 flex-col">
          <Home />
        </div>
      </main>
    </div>
  );
};

export default App;
