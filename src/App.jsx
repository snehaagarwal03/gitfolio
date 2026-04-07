import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import PublicOnlyRoute from "./components/ui/PublicOnlyRoute";
import LandingPage from "./pages/Landing/LandingPage";
import LoginPage from "./pages/Login/LoginPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import PortfolioPage from "./pages/Portfolio/PortfolioPage";
import ResumePage from "./pages/Resume/ResumePage";
import NotFoundPage from "./pages/NotFound/NotFoundPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <Routes>
            <Route element={<AppLayout />}>
              <Route
                path="/"
                element={
                  <PublicOnlyRoute>
                    <LandingPage />
                  </PublicOnlyRoute>
                }
              />
              <Route
                path="/login"
                element={
                  <PublicOnlyRoute>
                    <LoginPage />
                  </PublicOnlyRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/:username"
                element={<PortfolioPage />}
              />
              <Route
                path="/:username/resume"
                element={<ResumePage />}
              />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
