import React from "react";
import ImageUpload from "./components/ImageUpload";

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ImageUpload />
    </div>
  );
};

export default App;
