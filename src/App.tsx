import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ResponseSurvey } from "./pages/ResponseSurvey";
import { DevDashboard } from "./pages/DevDashboard";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ResponseSurvey />} />
        <Route path="/dev" element={<DevDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
