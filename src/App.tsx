import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TooltipTestPage } from "./test/tooltip/Tooltip.test";
import { ConfirmProvider } from "./context/confirm/Confirm.context";
import ConfirmTestPage from "./test/confirm/Confirm.test";
import { AlertProvider } from "./context/alert/Alert.context";
import AlertTestPage from "./test/alert/Alert.test";
import { ButtonProvider } from "./context/button/Button.context";
import ButtonTestPage from "./test/button/Button.test";

import HomePage from "./pages/app/Home.page";
import MainPage from "./docs/pages/Main.page";
import ShowcasePage from "./pages/package/Showcase.page";
import AlertDoc from "./docs/mdx/alert/Alert";
import { DateTimeProvider } from "./context/time/Time.context";
import DateTimeShowcasePage from "./test/time/Time.test";
import { OptionProvider } from "./context/options/Option.conetxt";
import OptionMenuShowcase from "./test/options/Option.text";
import { ActionMenuProvider } from "./context/action/Action.menu.context";
import ActionMenuShowcase from "./test/action/Action.test";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/test/components/action-menu" element={<ActionMenuShowcase/>}/>
        <Route path="/test/components/options" element={<OptionMenuShowcase/>}/>
        <Route path="/test/components/date-and-time" element={<DateTimeShowcasePage/>}/>
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
        <Route path="/test/components/buttons" element={<ButtonTestPage dark={false} setDark={function (): void {
          throw new Error("Function not implemented.");
        } }/>}/>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/docs" element={<MainPage/>}/>
        <Route path="/showcase" element={<ShowcasePage/>}/>
        <Route path="/docs/components/alerts" element={<AlertDoc/>}/>
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <ActionMenuProvider>
    <OptionProvider>
    <DateTimeProvider>
    <ButtonProvider>
    <AlertProvider>
    <ConfirmProvider>
      <AppRoutes />
    </ConfirmProvider>
    </AlertProvider>
    </ButtonProvider>
    </DateTimeProvider>
    </OptionProvider>
    </ActionMenuProvider>
  );
}
