import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TooltipTestPage } from "./test/tooltip/Tooltip.test";
import { ConfirmProvider } from "./context/confirm/Confirm.context";
import ConfirmTestPage from "./test/confirm/Confirm.test";
import { AlertProvider } from "./context/alert/Alert.context";
import AlertTestPage from "./test/alert/Alert.test";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/test/components/tooltip" element={<TooltipTestPage />} />
        <Route
          path="/test/components/confirm-modal"
          element={
            <ConfirmTestPage
              dark={false}
              setDark={function (): void {
                throw new Error("Function not implemented.");
              }}
            />
          }
        />
        <Route path="/test/components/alerts" element={<AlertTestPage dark={false} setDark={function (): void {
          throw new Error("Function not implemented.");
        } }/>}/>
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <AlertProvider>
    <ConfirmProvider>
      <AppRoutes />
    </ConfirmProvider>
    </AlertProvider>
  );
}
