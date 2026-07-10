import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ResponseSurvey } from "./pages/ResponseSurvey";
import { DevDashboard } from "./pages/DevDashboard";
import "./App.css";

const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

function App() {
  return (
    <BrowserRouter basename={basename || undefined}>
      <Routes>
        <Route path="/" element={<ResponseSurvey />} />
        <Route path="/dev" element={<DevDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
