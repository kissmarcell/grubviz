import { createRoot } from "react-dom/client";
import App from "./components/app.js";

// GRUB theme visualizer script
const domRoot = document.getElementById('app');
if (!domRoot) throw new Error('No app root element found');
const app = createRoot(domRoot);

app.render(<App />);