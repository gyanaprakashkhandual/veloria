import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TooltipTestPage } from "./test/tooltip/Tooltip.text";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/test/components/tooltip" element={<TooltipTestPage />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return <AppRoutes />;
}
