import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TooltipTestPage } from "./test/tooltip/Tooltip.test";
import { ConfirmProvider } from "./ui/overlay/confirm/Confirm.context";
import ConfirmTestPage from "./test/confirm/Confirm.test";
import { AlertProvider } from "./ui/feedback/alert/Alert.context";
import AlertTestPage from "./test/alert/Alert.test";
import { ButtonProvider } from "./ui/inputs/button/Button.context";
import ButtonTestPage from "./test/button/Button.test";

import HomePage from "./pages/app/Home.page";
import MainPage from "./docs/pages/Main.page";
import ShowcasePage from "./pages/package/Showcase.page";
import AlertDoc from "./docs/mdx/alert/Alert";
import { DateTimeProvider } from "./ui/inputs/time/Time.context";
import DateTimeShowcasePage from "./test/time/Time.test";
import { OptionProvider } from "./ui/inputs/options/Option.conetxt";
import OptionMenuShowcase from "./test/options/Option.text";
import { ActionMenuProvider } from "./ui/navigations/action/Action.menu.context";
import ActionMenuShowcase from "./test/action/Action.test";
import { WindowProvider } from "./ui/overlay/window/Window.context";
import WindowShowcase from "./test/window/Window.test";
import { InputProvider } from "./ui/inputs/inputs/Input.context";
import InputShowcase from "./test/input/Input.test";
import { SidebarProvider } from "./ui/navigations/sidebar/Sidebar.context";
import { NavbarProvider } from "./ui/navigations/navbar/Navbar.context";
import { BreadcrumbProvider } from "./ui/navigations/breadcrumb/Breadcrumb.context";
import { PaginationProvider } from "./ui/navigations/pagination/Pagination.context";
import { TableProvider } from "./ui/data/table/Table.context";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="test/components/inputs" element={<InputShowcase />} />
        <Route path="/test/components/window" element={<WindowShowcase />} />
        <Route
          path="/test/components/action-menu"
          element={<ActionMenuShowcase />}
        />
        <Route
          path="/test/components/options"
          element={<OptionMenuShowcase />}
        />
        <Route
          path="/test/components/date-and-time"
          element={<DateTimeShowcasePage />}
        />
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
        <Route
          path="/test/components/alerts"
          element={
            <AlertTestPage
              dark={false}
              setDark={function (): void {
                throw new Error("Function not implemented.");
              }}
            />
          }
        />
        <Route
          path="/test/components/buttons"
          element={
            <ButtonTestPage
              dark={false}
              setDark={function (): void {
                throw new Error("Function not implemented.");
              }}
            />
          }
        />
        <Route path="/" element={<HomePage />} />
        <Route path="/docs" element={<MainPage />} />
        <Route path="/showcase" element={<ShowcasePage />} />
        <Route path="/docs/components/alerts" element={<AlertDoc />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
      <PaginationProvider>
        <BreadcrumbProvider>
          <NavbarProvider>
            <SidebarProvider>
              <InputProvider>
                <WindowProvider>
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
                </WindowProvider>
              </InputProvider>
            </SidebarProvider>
          </NavbarProvider>
        </BreadcrumbProvider>
      </PaginationProvider>
  );
}
