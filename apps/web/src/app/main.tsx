import { createRoot } from "react-dom/client";
import { App } from "./App.js";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("[web] Root element #root not found in document");
}

createRoot(rootElement).render(<App />);
