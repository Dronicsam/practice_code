import React from "react";
import MPStart from "./MPStart.tsx";
import { assets } from "./assets/app.ts";

const App: React.FC = () => {
  return (
    <div>
      <MPStart assets={assets} />
    </div>
  );
};

export default App;
