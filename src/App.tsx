import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./hooks/useAuth";
import { ProjectProvider } from "./contexts/ProjectContext";
import { SocketProvider } from "./contexts/socket.context";
import { ThemeProvider } from "./contexts/ThemeContext";

// Pages
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { AppLayout } from "./components/layout/AppLayout";
import { ProjectListPage } from "./pages/projects/ProjectListPage";
import { ProjectSettingsPage } from "./pages/projects/ProjectSettingsPage";
// import { ProjectDashboardPage } from './pages/dashboard/ProjectDashboardPage';
import { SessionListPage } from "./pages/sessions/SessionListPage";
import { SessionDetailPage } from "./pages/sessions/SessionDetailPage";
import { UserListPage } from "./pages/users/UserListPage";
import { UserProfilePage } from "./pages/users/UserProfilePage";
import LoadingSpinner from "./components/loading/LoadingSpinner";

const ProjectDashboardPage = React.lazy(() =>
  import("./pages/dashboard/ProjectDashboardPage").then((module) => ({
    default: module.ProjectDashboardPage,
  })),
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <ProjectProvider>
                    <SocketProvider>
                      <AppLayout />
                    </SocketProvider>
                  </ProjectProvider>
                </ProtectedRoute>
              }
            >
              <Route index element={<ProjectListPage />} />
              <Route
                path=":id/dashboard"
                element={
                  <React.Suspense fallback={<LoadingSpinner />}>
                    <ProjectDashboardPage />
                  </React.Suspense>
                }
              />
              <Route path=":id/settings" element={<ProjectSettingsPage />} />
              <Route path=":id/sessions" element={<SessionListPage />} />
              <Route
                path=":id/sessions/:sessionId"
                element={<SessionDetailPage />}
              />
              <Route path=":id/users" element={<UserListPage />} />
              <Route path=":id/users/:userId" element={<UserProfilePage />} />
            </Route>

            <Route path="/" element={<Navigate to="/projects" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
