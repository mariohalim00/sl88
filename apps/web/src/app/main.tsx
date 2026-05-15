import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("[web] Root element #root not found in document");
}

createRoot(rootElement).render(<App />);
